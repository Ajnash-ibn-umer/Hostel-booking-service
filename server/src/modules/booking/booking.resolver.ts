import {
  Args,
  Context,
  Info,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { RentCalculatorResponse } from './enitities/rent-calculator.entity';
import { RentCalculatorInput } from './dto/rent-calculator.input';
import { BookingService } from './services/booking.service';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { Booking, BookingListResponse } from './enitities/booking.entity';
import { ListInputBooking } from './dto/list-booking.input';
import getProjection from 'src/shared/graphql/queryProjection';
import { generalResponse } from 'src/shared/graphql/entities/main.entity';
import { AdminBookingStatusChangeInput } from './dto/booking-approval-status-update.input';
import { BookingCreateInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import { VerifyPaymentInput } from './dto/verify-booking.input';

@UseGuards(AuthGuard)
@Resolver()
export class BookingResolver {
  constructor(private readonly bookingsService: BookingService) {}

  @UserTypes([USER_TYPES.PUBLIC])
  @Query(() => RentCalculatorResponse, { name: 'Booking_RentCalculator' })
  async calculateBedRent(
    @Args('dto') dto: RentCalculatorInput,
    @Context() context,
  ): Promise<RentCalculatorResponse | GraphQLError> {
    return this.bookingsService.calculateBedRent(dto);
  }

  @UserTypes([USER_TYPES.PUBLIC])
  @Mutation(() => Booking, { name: 'Booking_AdmissionFormSubmission' })
  async admissionFormSubmission(
    @Args('formData') dto: BookingCreateInput,
    @Context() context,
  ) {
    return this.bookingsService.admissionFormSubmission(dto);
  }

  @UserTypes([USER_TYPES.ADMIN, USER_TYPES.PUBLIC])
  @Query(() => BookingListResponse, { name: 'Booking_List' })
  async listBooking(
    @Args('dto') dto: ListInputBooking,
    @Context() context,
    @Info() info: GraphQLResolveInfo,
  ) {
    const projection = getProjection(info.fieldNodes[0]);

    return this.bookingsService.listBooking(dto, projection);
  }

  @UserTypes([USER_TYPES.ADMIN])
  @Mutation(() => generalResponse, { name: 'Booking_ApprovalStatusChange' })
  async bookingApprovalStatusChange(
    @Args('dto') dto: AdminBookingStatusChangeInput,
    @Context() context,
  ): Promise<generalResponse | GraphQLError> {
    const userId = context.req.user.userId;
    return this.bookingsService.bookingApprovalStatusChange(dto, userId);
  }

  @UserTypes([USER_TYPES.ADMIN])
  @Mutation(() => Booking, { name: 'Booking_UpdateAdmissionFormSubmission' })
  async updateAdmissionFormSubmission(
    @Args('formData') dto: UpdateBookingInput,
    @Context() context,
  ) {
    const userId = context.req.user.userId;
    return this.bookingsService.updateAdmissionFormSubmission(dto, userId);
  }

  @UserTypes([USER_TYPES.PUBLIC])
  @Mutation(() => generalResponse, { name: 'Booking_VerifyPayment' })
  async verifyPayment(
    @Args('dto') dto: VerifyPaymentInput,
    @Context() context,
  ): Promise<generalResponse | GraphQLError> {
    console.log('Verifying payment');
    const userId = context.req.user.userId;
    return this.bookingsService.verifyPayment(dto);
  }
}
