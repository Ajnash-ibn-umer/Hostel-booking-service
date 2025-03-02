import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateLaundryBookingInput } from './dto/create-laundry.input';
import { UpdateLaundryBookingInput } from './dto/update-laundry.input';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ContractRepository } from 'src/repositories/contract.repository';
import { LaundryBookingRepository } from './repositories/laundry-booking.repository';
import { GraphQLError } from 'graphql';
import { PaymentsRepository } from '../payments/repositories/payments.repository';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import { BOOKING_STATUS } from 'src/database/models/booking.model';
import {
  LAUNDRY_BOOKING_TYPE,
  LAUNDRY_REQUEST_STATUS,
  LaundryBooking,
} from 'src/database/models/laundry.model';
import * as dayjs from 'dayjs';
import {
  PaymentStatus,
  VOUCHER_TYPE,
} from 'src/database/models/payments.model';
import { ListInputLaundryBooking } from './dto/list-laundry-booking.input';
import { LaundryLimit, LaundryListResponse } from './entities/laundry.entity';
import {
  MatchList,
  Paginate,
  Search,
} from 'src/shared/utils/mongodb/filtration.util';
import { responseFormat } from 'src/shared/graphql/queryProjection';
import { Lookup } from 'src/shared/utils/mongodb/lookupGenerator';
import { MODEL_NAMES } from 'src/database/modelNames';
import { decodeAction } from 'next/dist/server/app-render/entry-base';

@Injectable()
export class LaundryService {
  constructor(
    private readonly contractRepo: ContractRepository,
    private readonly laundryBookingRepo: LaundryBookingRepository,
    private readonly paymentRepo: PaymentsRepository,

    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}
  async create(dto: CreateLaundryBookingInput, userId: string) {
    const startTime = new Date();
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      console.log({ userId });
      if (!dto.bookingDate) {
        throw 'Date is required for booking';
      }
      const userLaundryLimit = await this.contractRepo.findOne({
        userId: userId,
        status: STATUS_NAMES.ACTIVE,
      });
      if (dto.bookingType === LAUNDRY_BOOKING_TYPE.FREE) {
        if (
          !userLaundryLimit ||
          userLaundryLimit.laundryMonthlyCount === 0 ||
          !userLaundryLimit.laundryMonthlyCount
        ) {
          throw `Laundry Booking not available for this user`;
        }
        const userLaundryCount = await this.laundryBookingRepo.find(
          {
            createdUserId: userId,
            requestStatus: LAUNDRY_REQUEST_STATUS.APPROVED,
            bookingDate: {
              $gte: new Date(
                dto.bookingDate.getFullYear(),
                dto.bookingDate.getMonth(),
                1,
              ),
              $lt: new Date(
                dto.bookingDate.getFullYear(),
                dto.bookingDate.getMonth() + 1,
                1,
              ),
            },
          },
          {},
          session,
        );
        console.log({
          userLaundryCount: userLaundryCount.length,
          userLaundryLimit: userLaundryLimit.laundryMonthlyCount,
        });
        if (userLaundryCount.length >= userLaundryLimit.laundryMonthlyCount) {
          throw `Laundry Booking limit exceeded for this user`;
        }
      }
      const currentDate = dayjs();
      const bookingDate = dayjs(dto.bookingDate);

      if (bookingDate.diff(currentDate, 'day') > 15) {
        throw `Booking date must be within 15 days from today`;
      }

      const laundryBooking = await this.laundryBookingRepo.create(
        {
          bookingDate: dto.bookingDate,
          timeSlot: dto.timeSlot,
          requestStatus:
            dto.bookingType === LAUNDRY_BOOKING_TYPE.PAYED
              ? LAUNDRY_REQUEST_STATUS.PENDING
              : LAUNDRY_REQUEST_STATUS.APPROVED,
          bookingType: dto.bookingType,
          hostelId: userLaundryLimit.propertyId,
          userId: userId,
          status: STATUS_NAMES.ACTIVE,
          createdAt: startTime,
          createdUserId: userId,
        },
        session,
      );
      if (!laundryBooking) {
        throw new Error('Laundry booking creation failed');
      }
      if (dto.bookingType === LAUNDRY_BOOKING_TYPE.PAYED) {
        const bookingPayment = await this.paymentRepo.create(
          {
            voucherType: VOUCHER_TYPE.LAUNDRY,
            dueDate: bookingDate,
            voucherId: laundryBooking._id,
            remark: `Payment for payed laundry booking on ${dayjs(dto.bookingDate).format('DD/MM/YYYY')}`,
            userId: userId,
            // TODO: need to be change
            payAmount: 20,
            paymentStatus: PaymentStatus.PENDING,
            status: STATUS_NAMES.ACTIVE,
            createdAt: startTime,
            createdUserId: userId,
          },
          session,
        );
      }

      await session.commitTransaction();
      return laundryBooking;
    } catch (error) {
      await session.abortTransaction();
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    } finally {
      session.endSession();
    }
  }

  async listLaundryBookings(
    dto: ListInputLaundryBooking,
    projection: Record<string, any>,
  ): Promise<LaundryListResponse> {
    const pipeline: any[] = [];

    if (dto.searchingText && dto.searchingText !== '') {
      pipeline.push(Search(['description', 'guestNo'], dto.searchingText));
    }

    if (dto.dateFilter) {
      pipeline.push({
        $match: {
          bookingDate: {
            $gte: dto.dateFilter.from,
            $lte: dto.dateFilter.to,
          },
        },
      });
    }

    if (dto.monthlyFilter) {
      pipeline.push(
        {
          $addFields: {
            month: { $month: '$bookingDate' },
            year: { $year: '$bookingDate' },
          },
        },
        {
          $match: {
            month: dto.monthlyFilter,
            year: new Date().getFullYear(),
          },
        },
      );
    }
    pipeline.push(
      ...MatchList([
        {
          match: { status: dto.statusArray },
          _type_: 'number',
          required: true,
        },
        {
          match: { _id: dto.laundryBookingIds },
          _type_: 'objectId',
          required: false,
        },
        {
          match: { createdUserId: dto.createdUserIds },
          _type_: 'objectId',
          required: false,
        },
        {
          match: { hostelId: dto.propertyIds },
          _type_: 'objectId',
          required: false,
        },
        {
          match: { requestStatus: dto.requestStatusFilter },
          _type_: 'number',
          required: false,
        },
        {
          match: { bookingType: dto.bookingTypeFilter },
          _type_: 'number',
          required: false,
        },
        {
          match: { userId: dto.guestIds },
          _type_: 'objectId',
          required: false,
        },
      ]),
    );
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
            requestStatus: dto.sortOrder ?? 1,
          },
        });
        break;
      case 2:
        pipeline.push({
          $sort: {
            bookingDate: dto.sortOrder ?? 1,
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
    if (projection['list']['createdUser']) {
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.USER,
          params: { id: '$createdUserId' },
          conditions: { $_id: '$$id' },
          responseName: 'createdUser',
        }),
      );
    }

    if (projection['list']['hostel']) {
      console.log('in hostel');
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.HOSTEL,
          params: { id: '$hostelId' },
          project: responseFormat(projection['list']['hostel']),
          conditions: { $_id: '$$id' },
          responseName: 'hostel',
        }),
      );
    }

    if (projection['list']['user']) {
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.USER,
          params: { id: '$userId' },
          project: responseFormat(projection['list']['user']),
          conditions: { $_id: '$$id' },
          responseName: 'user',
        }),
      );
    }
    // Execute the aggregation pipeline
    const list = (await this.laundryBookingRepo.aggregate(
      pipeline,
    )) as LaundryBooking[];
    const totalCount = projection['totalCount']
      ? await this.laundryBookingRepo.totalCount(pipeline)
      : 0;

    return {
      list,
      totalCount: totalCount,
    };
  }

  async getUserLaundryLimit(userId: string): Promise<LaundryLimit> {
    try {
      const date = new Date();
      const userLaundryCount = await this.laundryBookingRepo.find(
        {
          createdUserId: userId,
          requestStatus: LAUNDRY_REQUEST_STATUS.APPROVED,
          bookingDate: {
            $gte: new Date(date.getFullYear(), date.getMonth(), 1),
            $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
          },
        },
        {},
      );

      const userLaundryLimit = await this.contractRepo.findOne({
        userId: userId,
        status: STATUS_NAMES.ACTIVE,
      });

      return {
        laundryTotalMonthlyLimit: userLaundryLimit.laundryMonthlyCount ?? 0,
        laundryMonthlyUsedCount: userLaundryCount.length ?? 0,
      };
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
}
