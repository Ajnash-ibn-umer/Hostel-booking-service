import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDamageAndSplitInput } from './dto/create-damage_and_split.input';
import { PayUpdateDamageAndSplitInput } from './dto/update-damage_and_split.input';
import { DamageAndSplitRepository } from './repositories/damage-and-split.repository';
import { DamageAndSplitDetailsRepository } from './repositories/damage-and-split-details.repository';
import mongoose from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';
import {
  AmountStatus,
  DamageAndSplit,
} from 'src/database/models/damage-and-split.model';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import { DamageAndSplitDetails } from 'src/database/models/damage-and-split-details.model';
import { PaymentsService } from '../payments/payments.service';
import { CreatePaymentInput } from '../payments/dto/create-payment.input';
import { VOUCHER_TYPE } from 'src/database/models/payments.model';
import { ListInputDamageAndSpit } from './dto/list-damage_and_split.input';
import { DamageAndSplitListResponse } from './entities/damage_and_split.entity';
import {
  MatchList,
  Paginate,
  Search,
} from 'src/shared/utils/mongodb/filtration.util';
import { responseFormat } from 'src/shared/graphql/queryProjection';
import { Lookup } from 'src/shared/utils/mongodb/lookupGenerator';
import { MODEL_NAMES } from 'src/database/modelNames';
import { generalResponse } from 'src/shared/graphql/entities/main.entity';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';

@Injectable()
export class DamageAndSplitService {
  constructor(
    private readonly damageAndSplitRepository: DamageAndSplitRepository,
    private readonly damageAndSplitDetailsRepository: DamageAndSplitDetailsRepository,
    private readonly paymentsService: PaymentsService,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}
  async create(
    dto: CreateDamageAndSplitInput,
    userId: string,
  ): Promise<DamageAndSplit | GraphQLError> {
    const txnSession = await this.connection.startSession();
    await txnSession.startTransaction();
    try {
      const newDamageAndSplit = await this.damageAndSplitRepository.create(
        {
          hostelId: dto.hostelId,
          title: dto.title,
          description: dto.description,
          documentUrl: dto.documentUrl,
          totalAmount: dto.totalAmount,
          dueDate: dto.dueDate,

          status: STATUS_NAMES.ACTIVE,
          createdAt: new Date(),
        },
        txnSession,
      );

      if (dto.splitDetails && dto.splitDetails.length > 0) {
        // TODO: create payment also
        const details = [];
        const paymentData: CreatePaymentInput[] = [];

        dto.splitDetails.forEach((detail) => {
          details.push({
            damageAndSplitId: newDamageAndSplit._id,
            userId: detail.userId,
            amount: detail.amount,
            status: STATUS_NAMES.ACTIVE,
            createdAt: new Date(),
          });

          paymentData.push({
            voucherType: VOUCHER_TYPE.DAMAGE_AND_SPLIT,
            dueDate: dto.dueDate,
            voucherId: newDamageAndSplit._id,
            userId: detail.userId,
            payAmount: detail.amount,
          });
        });

        await this.damageAndSplitDetailsRepository.insertMany(
          details as any,
          txnSession,
        );
        await this.paymentsService.create(paymentData, userId, txnSession);
      }

      await txnSession.commitTransaction();
      return newDamageAndSplit;
    } catch (error) {
      await txnSession.abortTransaction();
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    } finally {
      await txnSession.endSession();
    }
  }

  async listDamageAndSplit(
    dto: ListInputDamageAndSpit,
    projection: Record<string, any>,
  ): Promise<DamageAndSplitListResponse> {
    const pipeline: any[] = [];
    if (dto.searchingText && dto.searchingText !== '') {
      pipeline.push(Search(['description', 'title'], dto.searchingText));
    }
    pipeline.push(
      ...MatchList([
        {
          match: { status: dto.statusArray },
          _type_: 'number',
          required: true,
        },
        {
          match: { _id: dto.damageAndSplitIds },
          _type_: 'objectId',
          required: false,
        },
        {
          match: { hostelId: dto.hostelIds },
          _type_: 'objectId',
          required: false,
        },

        {
          match: { amountStatus: dto.amountStatusFilter },
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

    if (dto.dateFilter) {
      pipeline.push({
        $match: {
          createdAt: {
            $gte: dto.dateFilter.from,
            $lte: dto.dateFilter.to,
          },
        },
      });
    }

    if (dto?.userIds && dto?.userIds.length > 0) {
      const uids = dto.userIds.map((id) => new mongoose.Types.ObjectId(id));
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.DAMAGE_AND_SPLIT_DETAILS,
          params: { id: '$_id' },
          conditions: { $damageAndSplitId: '$$id' },
          isNeedUnwind: false,
          innerPipeline: [
            {
              $match: {
                userId: { $in: uids },
              },
            },
          ],
          responseName: 'splits',
        }),
        {
          $match: {
            splits: { $ne: [] },
          },
        },
      );
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
            title: dto.sortOrder ?? 1,
          },
        });
        break;
      case 2:
        pipeline.push({
          $sort: {
            status: dto.sortOrder ?? 1,
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

    if (projection['list']['splitDetails']) {
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.DAMAGE_AND_SPLIT_DETAILS,
          params: { id: '$_id' },
          project: responseFormat(projection['list']['splitDetails']),
          conditions: { $damageAndSplitId: '$$id' },
          isNeedUnwind: false,

          responseName: 'splitDetails',
        }),
      );
    }
    if (projection['list']['hostel']) {
      console.log('in hostl');
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.HOSTEL,
          params: { id: '$hostelId' },
          conditions: { $_id: '$$id' },
          project: responseFormat(projection['list']['hostel']),

          responseName: 'hostel',
        }),
      );
    }
    // Execute the aggregation pipeline
    const list = await this.damageAndSplitRepository.aggregate(pipeline);
    console.log(JSON.stringify(list));

    let totalCount = 0;
    if (projection && projection['totalCount']) {
      totalCount = await this.damageAndSplitRepository.totalCount(pipeline);
    }

    return {
      list: list as any[],
      totalCount,
    };
  }

  async statusChangeOfDamageAndSplit(
    dto: statusChangeInput,
    userId: string,
  ): Promise<generalResponse> {
    const startTime = new Date();
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const result = await this.damageAndSplitRepository.updateMany(
        {
          _id: { $in: dto.ids },
        },
        {
          $set: {
            updatedUserId: userId,
            updatedAt: startTime,
            status: dto._status,
          },
        },
      );

      const resultDetails =
        await this.damageAndSplitDetailsRepository.updateMany(
          {
            damageAndSplitId: { $in: dto.ids },
          },
          {
            $set: {
              updatedUserId: userId,
              updatedAt: startTime,
              status: dto._status,
            },
          },
        );
      await session.commitTransaction();
      return { message: 'Status updated successfully' };
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

  async paymentUpdate(
    dto: PayUpdateDamageAndSplitInput[],
    userId: string,
    session: mongoose.ClientSession = null,
  ): Promise<generalResponse> {
    const txnSession = session ?? (await this.connection.startSession());
    !session && (await txnSession.startTransaction());
    try {
      for (let pay of dto) {
        const damageAndSplitData = await this.damageAndSplitRepository.findOne({
          _id: pay._id,
        });

        if (!damageAndSplitData) {
          throw 'Damage and Split not found';
        }

        const damageAndSplitDetails =
          await this.damageAndSplitDetailsRepository.findOneAndUpdate(
            {
              damageAndSplitId: pay._id,
              userId: pay.userId,
            },
            {
              paymentId: pay.paymentId,
              received: pay.payedAmount,
              payed: true,
              updatedAt: new Date(),
              updatedUserId: userId,
            },
            txnSession,
          );
        if (!damageAndSplitDetails) {
          throw 'Damage and split not found';
        }
        damageAndSplitData.amountStatus =
          damageAndSplitData.receivedAmount + pay.payedAmount >=
          damageAndSplitData.totalAmount
            ? AmountStatus.FULLY_PAID
            : AmountStatus.PARTIALY_PAID;

        damageAndSplitData.receivedAmount += pay.payedAmount;

        await damageAndSplitData.save({ session: txnSession });
      }

      !session && (await txnSession.commitTransaction());
      return { message: 'Damgae split amount data updated' };
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
}
