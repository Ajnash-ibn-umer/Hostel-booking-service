import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentInput } from './dto/create-payment.input';
import {
  UpdatePaymentApprovalStatus,
  UpdatePaymentInput,
} from './dto/update-payment.input';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PaymentsRepository } from './repositories/payments.repository';
import {
  Payment,
  PaymentStatus,
  VOUCHER_TYPE,
} from 'src/database/models/payments.model';
import { GraphQLError } from 'graphql';
import {
  MatchList,
  Paginate,
  Search,
} from 'src/shared/utils/mongodb/filtration.util';
import { responseFormat } from 'src/shared/graphql/queryProjection';
import { PaymentsListResponse } from './entities/payment.entity';
import { ListInputPayments } from './dto/list-payment.input';
import { STATUS_NAMES, USER_TYPES } from 'src/shared/variables/main.variable';
import { database } from 'firebase-admin';
import { UserService } from '../user/service/user.service';
import { UserRepository } from '../user/repository/user.repository';
import { Lookup } from 'src/shared/utils/mongodb/lookupGenerator';
import { MODEL_NAMES } from 'src/database/modelNames';
import * as dayjs from 'dayjs';
import { PRICE_BASE_MODE } from 'src/database/models/hostel.model';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { generalResponse } from 'src/shared/graphql/entities/main.entity';
import { DamageAndSplitRepository } from '../damage_and_split/repositories/damage-and-split.repository';
import { DamageAndSplitDetailsRepository } from '../damage_and_split/repositories/damage-and-split-details.repository';
import { AmountStatus } from 'src/database/models/damage-and-split.model';
@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentRepo: PaymentsRepository,
    private readonly userRepo: UserRepository,
    private schedulerRegistry: SchedulerRegistry,
    private damageAndSplitRepo: DamageAndSplitRepository,
    private damageAndSplitDetailRepo: DamageAndSplitDetailsRepository,

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
      const insertData = dto.map((data) => {
        const id = data._id ?? new mongoose.Types.ObjectId();

        return {
          _id: id,
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
        };
      });

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
    if (projection['list']['user']) {
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.USER,
          params: { id: '$userId' },
          conditions: { $_id: '$$id' },
          responseName: 'user',
        }),
      );
    }

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

  async reccuringPaymentGeneration(session: mongoose.ClientSession = null) {
    const startTime = new Date();
    const txnSession = session ?? (await this.connection.startSession());
    !session && (await txnSession.startTransaction());
    try {
      // query user information based on condition
      //  that users doesnt have exisitng rent in this month

      const users: any = await this.userRepo.aggregate([
        {
          $match: {
            status: STATUS_NAMES.ACTIVE,
            isActive: true,
            userType: USER_TYPES.USER,
          },
        },
        ...Lookup({
          modelName: MODEL_NAMES.PAYMENTS,
          params: { id: '$_id' },
          isNeedUnwind: false,
          innerPipeline: [
            {
              $match: {
                voucherType: VOUCHER_TYPE.RENT,
                $expr: {
                  $eq: [{ $month: '$createdAt' }, startTime.getMonth() + 1],
                },
              },
            },
          ],
          conditions: { $userId: '$$id' },
          responseName: 'payments',
        }),

        {
          $match: {
            payments: { $size: 0 },
          },
        },

        ...Lookup({
          modelName: MODEL_NAMES.BOOKING,
          params: { id: '$bookingId' },
          conditions: { $_id: '$$id' },
          project: {
            $project: {
              _id: 1,
              status: 1,
              basePrice: 1,
              netAmount: 1,
              selectedPaymentBase: 1,
            },
          },
          responseName: 'booking',
        }),
        {
          $match: {
            'booking.selectedPaymentBase': PRICE_BASE_MODE.MONTHLY,
          },
        },
      ]);
      if (users && users.length === 0) {
        return 'Failed';
      }
      // TODO: set due date based on settings
      const dueDate = new Date(startTime);
      dueDate.setDate(dueDate.getDate() + 15);
      const paymentData = users.map((user): Payment => {
        return {
          voucherType: VOUCHER_TYPE.RENT,
          dueDate: dueDate,
          voucherId: user.booking?._id ?? '',
          payAmount: user.booking?.basePrice,
          userId: user._id,
          createdUserId: null,
          remark: `Rent for ${dayjs(startTime).format('MMMM')}`,
          status: STATUS_NAMES.ACTIVE,
          createdAt: startTime,
          paymentStatus: PaymentStatus.PENDING,
        };
      });
      console.log({ users });
      const payments = await this.paymentRepo.insertMany(
        paymentData,
        txnSession,
      );
      // create payment based on this user info
      !session && (await txnSession.commitTransaction());
      return 'Success';
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

  async updateApprovalStatusOfPayment(
    dto: UpdatePaymentApprovalStatus,
    userId: string,
  ): Promise<generalResponse> {
    const startTime = new Date();
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const payment = await this.paymentRepo.findOneAndUpdate(
        {
          _id: dto.paymentId,
          status: STATUS_NAMES.ACTIVE,
        },
        {
          updatedAt: startTime,
          updatedUserId: userId,
          payedDate: startTime,
          paymentStatus: dto.requestStatus,
        },
        session,
      );
      if (!payment) {
        throw new Error('payment not found');
      }

      if (payment.voucherType === VOUCHER_TYPE.DAMAGE_AND_SPLIT) {
        const damageAndSplit = await this.damageAndSplitRepo.findOne({
          _id: payment.voucherId,
        });
        await this.damageAndSplitDetailRepo.findOneAndUpdate(
          {
            userId: payment.userId,
            damageAndSplitId: payment.voucherId,
          },
          {
            received: payment.payAmount,
            payed: true,
          },
          session,
        );
        const splitPayments = await this.damageAndSplitDetailRepo.find({
          damageAndSplitId: payment.voucherId,
        });
        const fullyPayed = splitPayments.every((d) => d.payed === true);

        await damageAndSplit
          .updateOne({
            receivedAmount: damageAndSplit.receivedAmount + payment.payAmount,
            amountStatus:
              fullyPayed === true
                ? AmountStatus.FULLY_PAID
                : AmountStatus.PARTIALY_PAID,
          })
          .session(session);
      }
      await session.commitTransaction();
      return {
        message: 'Payment Approved',
      };
    } catch (error) {
      await session.abortTransaction();
      throw new GraphQLError(error.message, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    } finally {
      session.endSession();
    }
  }
}
