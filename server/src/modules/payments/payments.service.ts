import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PaymentsRepository } from './repositories/payments.repository';
import { Payment, PaymentStatus } from 'src/database/models/payments.model';
import { GraphQLError } from 'graphql';
import {
  MatchList,
  Paginate,
  Search,
} from 'src/shared/utils/mongodb/filtration.util';
import { responseFormat } from 'src/shared/graphql/queryProjection';
import { PaymentsListResponse } from './entities/payment.entity';
import { ListInputPayments } from './dto/list-payment.input';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import { database } from 'firebase-admin';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentRepo: PaymentsRepository,

    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}
  async create(
    dto: CreatePaymentInput[],
    userId: string,
    session: mongoose.ClientSession = null,
  ): Promise<Payment[]> {
    const txnSession = session ?? (await this.connection.startSession());
    !session && (await txnSession.startTransaction());
    try {
      const insertData = dto.map((data) => ({
        voucherType: data.voucherType,
        dueDate: data.dueDate,
        voucherId: data.voucherId,
        payAmount: data.payAmount,
        payedDate: data.payedDate ?? null,
        userId: data.userId,
        createdUserId: userId,
        remark: data.remark,
        status: STATUS_NAMES.ACTIVE,
        createdAt: new Date(),
        paymentStatus: data.paymentStatus ?? PaymentStatus.PENDING,
      }));

      const response = await this.paymentRepo.insertMany(
        insertData as any,
        txnSession,
      );
      if (!response) {
        throw 'Response not found in payment creation';
      }
      !session && (await txnSession.commitTransaction());
      return response;
    } catch (error) {
      !session && (await txnSession.abortTransaction());
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    } finally {
      !session && (await txnSession.endSession());
    }
  }

  async listPayments(
    dto: ListInputPayments,
    projection: Record<string, any>,
  ): Promise<PaymentsListResponse> {
    const pipeline: any[] = [];
    if (dto.searchingText && dto.searchingText !== '') {
      pipeline.push(Search(['dueDate', 'payAmount'], dto.searchingText));
    }
    pipeline.push(
      ...MatchList([
        {
          match: { status: dto.statusArray },
          _type_: 'number',
          required: true,
        },
        {
          match: { paymentStatus: dto.paymentStatusFilter },
          _type_: 'number',
          required: false,
        },
        {
          match: { _id: dto.paymentIds },
          _type_: 'objectId',
          required: false,
        },
        {
          match: { userId: dto.userIds },
          _type_: 'objectId',
          required: false,
        },
        {
          match: { voucherType: dto.voucherTypeFilter },
          _type_: 'number',
          required: false,
        },
      ]),
    );

    if (dto.dueDateFilter) {
      pipeline.push({
        $match: {
          dueDate: {
            $gte: dto.dueDateFilter.from,
            $lte: dto.dueDateFilter.to,
          },
        },
      });
    }

    if (dto.payedDateFilter) {
      pipeline.push({
        $match: {
          payedDate: {
            $gte: dto.payedDateFilter.from,
            $lte: dto.payedDateFilter.to,
          },
        },
      });
    }

    switch (dto.sortType) {
      case 0:
        pipeline.push({
          $sort: {
            createdAt: dto.sortOrder ?? 1,
          },
        });
        break;
      case 1:
        pipeline.push({
          $sort: {
            dueDate: dto.sortOrder ?? 1,
          },
        });
        break;
      case 2:
        pipeline.push({
          $sort: {
            paymentStatus: dto.sortOrder ?? 1,
          },
        });
        break;
      default:
        pipeline.push({
          $sort: {
            _id: dto.sortOrder ?? 1,
          },
        });
        break;
    }

    pipeline.push(...Paginate(dto.skip, dto.limit));

    projection && pipeline.push(responseFormat(projection['list']));

    // Execute the aggregation pipeline
    const list = await this.paymentRepo.aggregate(pipeline);
    console.log(JSON.stringify(list));

    let totalCount = 0;
    if (projection && projection['totalCount']) {
      totalCount = await this.paymentRepo.totalCount(pipeline);
    }

    return {
      list: list as any[],
      totalCount,
    };
  }
}
