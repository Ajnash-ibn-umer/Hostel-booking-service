import { HttpStatus, Injectable } from '@nestjs/common';
import { HostelRepository } from '../hostels/repositories/hostel.repository';
import { RoomRepository } from '../hostels/repositories/room.repository';
import { BedRepository } from '../hostels/repositories/bed.repository';
import { CounterService } from 'src/modules/counter/counter.service';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { PipelineStage } from 'mongoose';
import { RentCalculatorInput } from '../dto/rent-calculator.input';
import { RentCalculatorResponse } from '../enitities/rent-calculator.entity';
import { GraphQLAbstractType, GraphQLError } from 'graphql';
import {
  AVAILABILITY_STATUS,
  PRICE_BASE_MODE,
} from 'src/database/models/hostel.model';
import { Lookup } from 'src/shared/utils/mongodb/lookupGenerator';
import { MODEL_NAMES } from 'src/database/modelNames';
import { responseFormat } from 'src/shared/graphql/queryProjection';
import { Bed } from '../hostels/entities/bed.entity';
import {
  BED_POSITION,
  STATUS_NAMES,
  USER_TYPES,
} from 'src/shared/variables/main.variable';
import { BookingRepository } from '../repositories/booking.repository';
import { BOOKING_STATUS } from 'src/database/models/booking.model';
import { ListInputBooking } from '../dto/list-booking.input';
import {
  MatchList,
  Paginate,
  Search,
} from 'src/shared/utils/mongodb/filtration.util';
import { AdminBookingStatusChangeInput } from '../dto/booking-approval-status-update.input';
import { generalResponse } from 'src/shared/graphql/entities/main.entity';
import { BookingStatusHistoryRepository } from '../repositories/booking-status.repository';
import { BookingCreateInput } from '../dto/create-booking.input';
import { UpdateBookingInput } from '../dto/update-booking.input';
import { VerifyPaymentInput } from '../dto/verify-booking.input';
import { ContractRepository } from 'src/repositories/contract.repository';
import { InvoiceRepository } from 'src/repositories/invoice.repository';
import { InvoiceItemRepository } from 'src/repositories/invoice-item.repository';
import { TranasactionRepository } from 'src/repositories/transaction.repository';
import { PAYMENT_STATUS } from 'src/database/models/transaction.model';
import { UserService } from 'src/modules/user/service/user.service';
import { VACCATE_STATUS } from 'src/database/models/contract.model';
import { MailerService } from 'src/modules/mailer/mailer.service';
import { EMAIL_TEMPLATES } from 'src/modules/mailer/dto/create-mailer.input';
import * as dayjs from 'dayjs';
import { PaymentsService } from 'src/modules/payments/payments.service';
import { VOUCHER_TYPE } from 'src/database/models/payments.model';
@Injectable()
export class BookingService {
  constructor(
    private readonly hostelRepository: HostelRepository,
    private readonly userService: UserService,
    private readonly mailService: MailerService,
    private readonly paymentService: PaymentsService,

    private readonly roomRepository: RoomRepository,
    private readonly bedRepository: BedRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly bookingStatusHistoryRepository: BookingStatusHistoryRepository,
    private readonly contractRepository: ContractRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
    private readonly transactionRepository: TranasactionRepository,
    private readonly counterService: CounterService,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}
  async calculateBedRent(
    dto: RentCalculatorInput,
  ): Promise<RentCalculatorResponse | GraphQLError> {
    try {
      const roomId = new mongoose.Types.ObjectId(dto.roomId);
      const bed: any = await this.bedRepository.aggregate([
        {
          $match: {
            $and: [
              { roomId: roomId },

              {
                paymentBase: { $in: [dto.paymentBase, PRICE_BASE_MODE.BOTH] },
              },

              {
                bedPosition: dto.bedPosition,
              },
              {
                availabilityStatus: AVAILABILITY_STATUS.AVAILABLE,
              },
            ],
          },
        },
        ...Lookup({
          modelName: MODEL_NAMES.ROOM_TYPES,
          params: { id: '$roomTypeId' },
          conditions: { $_id: '$$id' },
          responseName: 'roomType',
        }),
      ]);
      console.log({ bed });
      if (!bed || bed.length === 0) {
        return {
          bedAvailablity: false,
          message: 'Bed Not found for your requirment in this room',
          rent: 0,
          roomId: dto.roomId,
          securityDeposit: 0,
        };
      }

      if (!bed[0].roomType) {
        throw 'Room Type not defined for this room';
      }

      const selectedBed = bed[0];

      let rent = 0;
      let securityDeposit = 0;
      if (dto.paymentBase === PRICE_BASE_MODE.MONTHLY) {
        if (dto.bedPosition === BED_POSITION.LOWER) {
          rent = selectedBed.roomType.rentMonthlyLower;
          securityDeposit = selectedBed.roomType.securityDepositForLower || 0;
        } else if (dto.bedPosition === BED_POSITION.UPPER) {
          rent = selectedBed.roomType.rentMonthlyUpper;
          securityDeposit = selectedBed.roomType.securityDepositForUpper || 0;
        }
      } else if (dto.paymentBase === PRICE_BASE_MODE.DAILY) {
        if (dto.bedPosition === BED_POSITION.UPPER) {
          rent = selectedBed.roomType.rentDailyUpper;
        } else if (dto.bedPosition === BED_POSITION.LOWER) {
          rent = selectedBed.roomType.rentDailyLower;
        }
      }
      console.log({ selectedBed });
      return {
        bedAvailablity: true,
        rent,
        securityDeposit,
        roomId: roomId.toString(),
        message: 'Bed found',
        tempSelectedBedId: selectedBed._id.toString(),
      };
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async admissionFormSubmission(dto: BookingCreateInput) {
    const time = Date.now();

    const txnSession = await this.connection.startSession();
    await txnSession.startTransaction();
    try {
      // TODO: veriffy amount

      const bedAvailablity = await this.bedRepository.findOne({
        _id: dto.bedId,
        status: STATUS_NAMES.ACTIVE,
        availabilityStatus: AVAILABILITY_STATUS.AVAILABLE,
      });

      if (!bedAvailablity) {
        throw 'Bed not available OR already occupied';
      }

      const rentData = (await this.calculateBedRent({
        bedPosition: dto.bedPosition,
        paymentBase: dto.selectedPaymentBase,
        roomId: dto.roomId,
      })) as RentCalculatorResponse;

      if (rentData.rent !== dto.basePrice) {
        throw new Error('Rent amount mismatch, please try again');
      }

      if (rentData.securityDeposit !== dto.securityDeposit) {
        throw new Error('Security Deposit amount mismatch, please try again');
      }

      const bookingNumber = await this.counterService.getAndIncrementCounter(
        {
          entityName: MODEL_NAMES.BOOKING,
        },
        1,
        txnSession,
      );
      // const bookingExist = await this.bookingRepository.findOne({
      //   phone: dto.phone,
      //   status: 1,
      //   bookingStatus: { $gte: BOOKING_STATUS.PAYMENT_SUCCESS },
      // });
      const phoneExists = await this.userService.findOneActivatedUserByPhone(
        dto.phone,
        true,
      );
      console.log(phoneExists);
      if (phoneExists) {
        throw 'User with this same phone number already exists. try another number';
      }
      const newBooking = await this.bookingRepository.create(
        {
          ...dto,
          netAmount: dto.netAmount,
          dob: new Date(dto.dob),
          bookingNumber: `${bookingNumber.prefix}${bookingNumber.count}`,
          bookingStatus: BOOKING_STATUS.FORM_COMPLETED,
          createdAt: time,
          updatedAt: time,
          status: STATUS_NAMES.ACTIVE,
        },
        txnSession,
      );

      //  create booking status history

      const bookingStatus = await this.bookingStatusHistoryRepository.create(
        {
          bookingId: newBooking._id,
          bookingStatus: BOOKING_STATUS.FORM_COMPLETED,
          description: `Booking started`,
          createdAt: time,
          createdUserId: null,
        },
        txnSession,
      );
      // TODO: payment initialisation

      await txnSession.commitTransaction();
      return newBooking;
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

  async updateAdmissionFormSubmission(dto: UpdateBookingInput, userId: string) {
    const time = Date.now();

    const txnSession = await this.connection.startSession();
    await txnSession.startTransaction();
    try {
      const newBooking = await this.bookingRepository.create(
        {
          ...dto,
          updatedAt: time,
          updatedUserId: userId,
        },
        txnSession,
      );

      await txnSession.commitTransaction();
      return newBooking;
    } catch (error) {
      await txnSession.abortTransaction();

      console.error('Error submitting admission form:', error);
      throw new GraphQLError('Failed to submit admission form', {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    } finally {
      await txnSession.endSession();
    }
  }

  async listBooking(dto: ListInputBooking, projection: Record<string, any>) {
    try {
      const pipeline: any[] = [];
      if (dto.searchingText && dto.searchingText !== '') {
        pipeline.push(
          Search(
            ['email', 'name', 'phone', 'bookingNumber', 'companyName', 'regNo'],
            dto.searchingText,
          ),
        );
      }
      console.log('in search -1');

      pipeline.push(
        ...MatchList([
          {
            match: { status: dto.statusArray },
            _type_: 'number',
            required: true,
          },
          {
            match: { propertyId: dto.propertyIds },
            _type_: 'objectId',
            required: false,
          },
          {
            match: { roomId: dto.roomIds },
            _type_: 'objectId',
            required: false,
          },
          {
            match: { _id: dto.bookingIds },
            _type_: 'objectId',
            required: false,
          },
          {
            match: { invoiceId: dto.invoiceIds },
            _type_: 'objectId',
            required: false,
          },
          {
            match: { bedId: dto.bedIds },
            _type_: 'objectId',
            required: false,
          },
          {
            match: { bookingStatus: dto.bookingStatus },
            _type_: 'number',
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
              name: dto.sortOrder ?? 1,
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
      console.log('in lookup');
      if (projection['list']['bed']) {
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
      if (projection['list']['room']) {
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
      if (projection['list']['property']) {
        pipeline.push(
          ...Lookup({
            modelName: MODEL_NAMES.HOSTEL,
            params: { id: '$propertyId' },
            project: responseFormat(projection['list']['property']),
            conditions: { $_id: '$$id' },
            responseName: 'property',
          }),
        );
      }
      const list =
        ((await this.bookingRepository.aggregate(
          pipeline as PipelineStage[],
        )) as any[]) || [];

      const totalCount = await this.bookingRepository.totalCount(pipeline);

      return {
        list,
        totalCount: totalCount,
      };
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
  /**
   * Updates the booking status for multiple bookings at once.//+
   
    @param {AdminBookingStatusChangeInput} dto - The input data for the booking status change.//+
    @param {string} userId - The ID of the user performing the status change.//+
   //+
    @returns {Promise<generalResponse | GraphQLError>} - A promise that resolves to a general response object if successful,//+
    or a GraphQLError if an error occurs.//+
   //+
    @throws Throws an error if no booking IDs are provided in the input data.//+
    @throws Throws an error if the booking status update fails.//+
  */
  async bookingApprovalStatusChange(
    dto: AdminBookingStatusChangeInput,
    userId: string,
  ): Promise<generalResponse | GraphQLError> {
    const startTime = new Date();
    const txnSession = await this.connection.startSession();

    await txnSession.startTransaction();
    try {
      let responseMsg = 'Booking status updated successfully';
      if (dto.bookingIds.length === 0) {
        throw 'No booking ids provided';
      }

      const updateData = {
        bookingStatus: dto.status,
        updatedAt: startTime,
        updatedUserId: userId,
      };
      // updateData,

      const bookingInfo = await this.bookingRepository.findOne(
        {
          _id: dto.bookingIds,
        },
        {},
        txnSession,
        ['propertyId'],
      );

      if (dto.status === BOOKING_STATUS.ADMIN_APPROVED) {
        console.log('admin apporval');
        const user = await this.userService.findOneUserByBookingId(
          dto.bookingIds,
        );
        if (!dto.selectedBedId) {
          throw 'Bed not selected';
        }
        const bedData: any = await this.bedRepository.findOne(
          {
            _id: dto.selectedBedId,
            status: STATUS_NAMES.ACTIVE,
            availabilityStatus: AVAILABILITY_STATUS.AVAILABLE,
          },
          {},
          txnSession,
          ['roomTypeId', 'propertyId'],
        );

        if (!bedData) {
          throw 'Selected Bed not found Or This bed already Booked!';
        }
        const update = await bedData
          .updateOne({
            availabilityStatus: AVAILABILITY_STATUS.OCCUPIED,
            updatedAt: startTime,
            updatedUserId: userId,
          })
          .session(txnSession);
        updateData['bedName'] = bedData.name;
        updateData['bedId'] = dto.selectedBedId;
        updateData['roomId'] = bedData.roomId;
        updateData['bedPosition'] = bedData.bedPosition;
        // update contract
        await this.contractRepository.findOneAndUpdate(
          {
            bookingId: bookingInfo._id,
            status: STATUS_NAMES.ACTIVE,
          },
          {
            roomId: bedData.roomId,
            bedId: bedData._id,
          },
          txnSession,
        );
        // create payment bills
        const paymentSd = await this.paymentService.create(
          [
            {
              dueDate: bookingInfo.createdAt,
              payedDate: startTime,
              voucherId: bookingInfo._id,
              userId: user._id,
              payAmount: bookingInfo.securityDeposit,
              paymentStatus: PAYMENT_STATUS.SUCCESS,
              remark: 'First Month Rent',
              voucherType: VOUCHER_TYPE.RENT,
            },
            {
              dueDate: bookingInfo.createdAt,
              voucherId: bookingInfo._id,
              payedDate: startTime,
              userId: user._id,
              payAmount: bookingInfo.securityDeposit,
              paymentStatus: PAYMENT_STATUS.SUCCESS,
              remark: 'Security Deposit',
              voucherType: VOUCHER_TYPE.SECURITY_DEPOSIT,
            },
          ],
          userId,
          txnSession,
        );
        responseMsg = `Booking approved successfully for booking number: ${bookingInfo.bookingNumber}`;
        this.mailService.send({
          subject: `Booking Approved`,
          to: user.email,
          template: EMAIL_TEMPLATES.BOOKING_APPROVAL,
          context: {
            guestName: user.name,
            allottedBed: bedData?.name ?? '',
            berthType: BED_POSITION[bedData.bedPosition].toLowerCase(),
            roomShareType: bedData?.roomTypeId?.name ?? '',
            hostelName: bedData?.propertyId?.name ?? '',
            bookingNumber: bookingInfo.bookingNumber,
            approvalDate: dayjs(startTime).format('DD/MM/YYYY'),
          },
        });
      }

      if (dto.status === BOOKING_STATUS.CHECK_IN) {
        updateData['checkInDate'] = dto.date;
        const user = await this.userService.findOneUserByBookingId(
          dto.bookingIds,
        );

        await this.userService.activateUser(user._id, txnSession);

        responseMsg = `Check-in confirmed for user: ${user.name} on ${dayjs(dto.date).format('DD/MM/YYYY')}`;
        this.mailService.send({
          subject: `Check In Confirmed`,
          to: user.email,
          template: EMAIL_TEMPLATES.CHECKIN_CONFIRMED,
          context: {
            name: user.name,
            userNumber: user.userNo,
            hostelName: (bookingInfo as any)?.propertyId?.name ?? '',
            checkInDate: dayjs(dto.date).format('DD/MM/YYYY'),
          },
        });
      }

      const bookingStatusHistoryEntries = {
        bookingId: dto.bookingIds,
        bookingStatus: dto.status,
        description: dto.remark,
        createdAt: startTime,
        createdUserId: userId,
      };
      const updateBooking = await bookingInfo
        .updateOne(updateData)
        .session(txnSession);

      if (!bookingInfo) {
        throw 'Booking Status update failed';
      }
      const bookingStatus = await this.bookingStatusHistoryRepository.create(
        bookingStatusHistoryEntries,
        txnSession,
      );
      await txnSession.commitTransaction();
      return {
        message: responseMsg,
      };
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

  async verifyPayment(dto: VerifyPaymentInput) {
    const startTime = new Date();
    const txnSession = await this.connection.startSession();

    await txnSession.startTransaction();
    try {
      let paymentStatus: boolean;
      paymentStatus = true;
      // TODO: Payment verfication

      // TODO: update admission book form status
      const count = await this.counterService.getAndIncrementCounter(
        {
          entityName: MODEL_NAMES.CONTRACTS,
        },
        1,
        txnSession,
      );

      const bookingData = await this.bookingRepository.findOneAndUpdate(
        {
          _id: dto.bookingId,
        },
        {
          regNo: `${count.prefix}${count.count}`,
        },
        txnSession,
      );

      console.log('in booking');

      if (!bookingData) {
        throw 'Booking Not Found';
      }
      console.log('in booking 2');

      if (!paymentStatus) {
        const transaction = await this.transactionRepository.create(
          {
            amount: dto.amount,
            bookingId: dto.bookingId,
            transactionId: dto.orderId ?? '',
            remark: 'Payment failed',
            paymentType: 1,
            invoiceId: null,
            paymentStatus: PAYMENT_STATUS.FAILED,
            createdAt: startTime,
            updatedAt: startTime,
          },
          txnSession,
        );
      }
      console.log('in booking 3');

      if (paymentStatus === true) {
        console.log('in booking 4');

        const bookingInfo = await this.bookingApprovalStatusChange(
          {
            bookingIds: dto.bookingId,
            date: new Date(),
            status: BOOKING_STATUS.PAYMENT_SUCCESS,

            remark: `payment successful`,
          },
          null,
        );

        if (!bookingInfo) {
          throw ` Booking Update Failed!`;
        }
        console.log('Status change updated');
        // TODO: create invoice
        //  create new user and contract

        const newUser = await this.userService.createUser(
          {
            email: bookingData.email,
            password: '',
            name: bookingData.name,
            phoneNumber: bookingData.phone,
            profileImgUrl: null,
            roleId: null,
            bookingId: dto.bookingId.toString(),
            userType: USER_TYPES.USER,
          },
          txnSession,
        );
        console.log('User created');
        const newContract = await this.contractRepository.create(
          {
            userId: newUser._id,
            bookingId: bookingData._id,
            roomId: bookingData.roomId,
            bedId: bookingData.bedId,
            propertyId: bookingData.propertyId,
            contractFrom: bookingData.contractFrom,
            contractTo: bookingData.contractTo,
            vaccatStatus: VACCATE_STATUS.IN_CONTRACT,
            laundryMonthlyCount: bookingData.laudryFacility ? 4 : 0,
            createdAt: startTime,
            status: STATUS_NAMES.ACTIVE,
          },
          txnSession,
        );

        console.log('Email', startTime);

        //   send notification
        const hostel = await this.hostelRepository.findOne(
          { _id: bookingData.propertyId },
          { name: 1 },
        );
        const bookingDate = dayjs(startTime).format('DD/MM/YYYY');
        const totalDays =
          bookingData.totalDays && bookingData.totalDays !== 0
            ? bookingData.totalDays.toString()
            : null;
        this.mailService.send({
          subject: `Booking Successful`,
          to: bookingData.email,
          template: EMAIL_TEMPLATES.BOOKING_SUCCESSFULL,
          context: {
            customerName: bookingData.name,
            bookingNumber: bookingData.bookingNumber,
            bookingDate: bookingDate,
            securityDeposit: bookingData.securityDeposit.toString(),
            totalAmount: bookingData.netAmount.toString() ?? '0',
            totalDays: totalDays,
            rent: bookingData.basePrice.toString(),
            hostelName: hostel.name ?? '',
          },
        });
      }
      await txnSession.commitTransaction();

      return {
        message: 'Booking status updated successfully',
      };
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
}
