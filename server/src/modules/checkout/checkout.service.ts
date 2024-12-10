import * as dayjs from 'dayjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCheckoutInput } from './dto/create-checkout.input';
import {
  ForcedCheckoutInput,
  UpdateCHeqoutRequestApprovalStatus,
} from './dto/update-checkout.input';
import { CheckoutRequestRepository } from './repositories/checkout-request.repository';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { SessionOption } from 'mongoose';
import { GraphQLError } from 'graphql';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import {
  CHECKOUT_APPROVAL_STATUS,
  CheckoutRequest,
} from 'src/database/models/checkout-request.model';
import { generalResponse } from 'src/shared/graphql/entities/main.entity';
import { UserRepository } from '../user/repository/user.repository';
import { ContractRepository } from 'src/repositories/contract.repository';
import { BedRepository } from '../booking/hostels/repositories/bed.repository';
import { AVAILABILITY_STATUS } from 'src/database/models/hostel.model';
import { VACCATE_STATUS } from 'src/database/models/contract.model';
import { ListInputCheckoutRequest } from './dto/list-checkout-request.dto';
import { CheckoutRequestListResponse } from './entities/checkout.entity';
import {
  MatchList,
  Paginate,
  Search,
} from 'src/shared/utils/mongodb/filtration.util';
import { responseFormat } from 'src/shared/graphql/queryProjection';
import { Lookup } from 'src/shared/utils/mongodb/lookupGenerator';
import { MODEL_NAMES } from 'src/database/modelNames';
import { MailerService } from '../mailer/mailer.service';
import { EMAIL_TEMPLATES } from '../mailer/dto/create-mailer.input';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly checkoutRequestRepo: CheckoutRequestRepository,
    private readonly userRepo: UserRepository,
    private readonly contractRepo: ContractRepository,
    private readonly mailService: MailerService,

    private readonly bedRpo: BedRepository,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}
  async create(dto: CreateCheckoutInput, userId: string) {
    const startTime = new Date();
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const newCheckoutRequest = await this.checkoutRequestRepo.create(
        {
          bedId: dto.bedId,
          roomId: dto.roomId,
          guestId: dto?.guestId ?? userId,
          bookingId: dto.bookingId,
          contractId: dto.contractId,
          guestNo: dto.guestNo,
          vaccatingDate: dto.vaccatingDate,
          checkoutApprovalStatus: CHECKOUT_APPROVAL_STATUS.PENDING,
          hostelId: dto.hostelId,
          description: dto.description,
          createdUserId: userId,
          createdAt: startTime,
          status: STATUS_NAMES.ACTIVE,
        },
        session,
      );
      await this.contractRepo.findOneAndUpdate(
        {
          _id: dto.contractId,
          status: STATUS_NAMES.ACTIVE,
        },
        {
          vaccatStatus: VACCATE_STATUS.VACCATE_PENDING,
        },
      );
      await session.commitTransaction();
      return newCheckoutRequest;
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

  async updateApprovalStatus(
    dto: UpdateCHeqoutRequestApprovalStatus,
    userId: string,
  ): Promise<generalResponse> {
    const startTime = new Date();
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const checkout = await this.checkoutRequestRepo.findOneAndUpdate(
        {
          _id: dto.chequoutRequestId,
        },
        {
          updatedAt: startTime,
          updatedUserId: userId,
          checkoutApprovalStatus: dto.requestStatus,
          remark: dto.remark,
        },
        session,
      );
      if (!checkout) {
        throw new Error('checkout not found');
      }
      if (dto.requestStatus === CHECKOUT_APPROVAL_STATUS.APPROVED) {
        await this.checkout(checkout, userId, session);
      }

      await session.commitTransaction();
      return {
        message:
          'Status changed to ' + CHECKOUT_APPROVAL_STATUS[dto.requestStatus],
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

  async checkout(
    checkout: ForcedCheckoutInput | CheckoutRequest | any,
    userId: string,
    session: SessionOption['session'] = null,
  ) {
    return new Promise(async (resolve, reject) => {
      const startTime = new Date();
      const txnSession = session || (await this.connection.startSession());
      const time = new Date();
      !session && (await txnSession.startTransaction());

      try {
        const bed = await this.bedRpo.findOneAndUpdate(
          {
            _id: checkout.bedId,
          },
          {
            availabilityStatus: AVAILABILITY_STATUS.AVAILABLE,
            updatedAt: startTime,
            updatedUserId: userId,
          },
          session,
        );

        const contract = await this.contractRepo.findOneAndUpdate(
          {
            _id: checkout.contractId,
          },
          {
            vaccatStatus: VACCATE_STATUS.VACCATED,
            updatedAt: startTime,
            updatedUserId: userId,
          },
          session,
        );

        const user = await this.userRepo.findOneAndUpdate(
          {
            _id: checkout.guestId,
          },
          {
            isActive: false,
            updatedAt: startTime,
            status: STATUS_NAMES.DELETE,
            updatedUserId: userId,
          },
          session,
        );
        const hostelInfo = await this.bedRpo.findOne(
          { _id: checkout.bedId },
          { propertyId: 1 },
          txnSession,
          ['propertyId'],
        );
        this.mailService.send({
          subject: `Checkout Request Approved`,
          to: user.email,
          template: EMAIL_TEMPLATES.CHECKOUT_CONFIRMED,
          context: {
            name: user.name,
            userNumber: user.userNo ?? '',
            hostelName: (hostelInfo.propertyId as any).name,
            checkOutDate: dayjs(checkout.vaccatingDate as any).format(
              'DD/MM/YYYY',
            ),
          },
        });
        !session && (await txnSession.commitTransaction());
        resolve('sucessful checkout');
      } catch (error) {
        !session && (await txnSession.abortTransaction());
        reject(new Error(error));
      } finally {
        !session && (await txnSession.endSession());
      }
    });
  }
  async listCheckoutRequests(
    dto: ListInputCheckoutRequest,
    projection: Record<string, any>,
  ): Promise<CheckoutRequestListResponse> {
    const pipeline: any[] = [];

    if (dto.searchingText && dto.searchingText !== '') {
      pipeline.push(Search(['description', 'guestNo'], dto.searchingText));
    }
    console.log(dto.createdUserIds);
    pipeline.push(
      ...MatchList([
        {
          match: { status: dto.statusArray },
          _type_: 'number',
          required: true,
        },
        {
          match: { _id: dto.checkoutReqIds },
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
          match: { roomId: dto.roomIds },
          _type_: 'objectId',
          required: false,
        },
        {
          match: { checkoutApprovalStatus: dto.requestStatus },
          _type_: 'number',
          required: false,
        },
        {
          match: { bedId: dto.bedIds },
          _type_: 'objectId',
          required: false,
        },
        {
          match: { guestId: dto.guestIds },
          _type_: 'objectId',
          required: false,
        },
        {
          match: { contractId: dto.contractIds },
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
            checkoutApprovalStatus: dto.sortOrder ?? 1,
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

    if (projection['list']['galleries']) {
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.COMPLAINTS_GALLERY_LINKS,
          params: { id: '$_id' },
          conditions: { $complaintId: '$$id' },
          responseName: 'galleries',
          isNeedUnwind: false,
          innerPipeline: [
            ...Lookup({
              modelName: MODEL_NAMES.GALLERY,
              params: { id: '$galleryId' },
              project: responseFormat(projection['list']['galleries']),
              conditions: { $_id: '$$id' },
              responseName: 'galleries',
            }),
          ],
        }),
        {
          $addFields: {
            galleries: '$galleries.galleries',
          },
        },
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

    if (projection['list']['room']) {
      console.log('in room');
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.ROOM,
          params: { id: '$roomId' },
          project: responseFormat(projection['list']['room']),
          conditions: { $_id: '$$id' },
          responseName: 'room',
        }),
      );
    }

    if (projection['list']['bed']) {
      console.log('in room');
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.BED,
          params: { id: '$bedId' },
          project: responseFormat(projection['list']['bed']),
          conditions: { $_id: '$$id' },
          responseName: 'bed',
        }),
      );
    }

    if (projection['list']['contract']) {
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.CONTRACTS,
          params: { id: '$contractId' },
          project: responseFormat(projection['list']['contract']),
          conditions: { $_id: '$$id' },
          responseName: 'contract',
        }),
      );
    }

    if (projection['list']['guest']) {
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.USER,
          params: { id: '$guestId' },
          project: responseFormat(projection['list']['guest']),
          conditions: { $_id: '$$id' },
          responseName: 'guest',
        }),
      );
    }
    // Execute the aggregation pipeline
    const list = (await this.checkoutRequestRepo.aggregate(
      pipeline,
    )) as CheckoutRequest[];
    const totalCount = projection['totalCount']
      ? await this.checkoutRequestRepo.totalCount(pipeline)
      : 0;

    return {
      list,
      totalCount: totalCount,
    };
  }
}
