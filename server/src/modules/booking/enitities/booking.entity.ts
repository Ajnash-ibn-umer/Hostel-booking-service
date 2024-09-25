import { Field, ObjectType, Int, ID, PartialType } from '@nestjs/graphql';
import { BOOKING_STATUS } from 'src/database/models/booking.model';
import { PRICE_BASE_MODE } from 'src/database/models/hostel.model';
import { Base } from 'src/shared/graphql/entities/main.entity';
import enumToString from 'src/shared/utils/enumTostring';
import { BED_POSITION } from 'src/shared/variables/main.variable';

@ObjectType()
export class Booking extends PartialType(Base) {
  @Field(() => Int, {
    nullable: true,
    description: enumToString(BOOKING_STATUS),
  })
  bookingStatus: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  bookingNumber: string;

  @Field({ nullable: true })
  regNo: string;

  @Field({ nullable: true })
  idCardNumber: string;

  @Field({ nullable: true })
  companyName: string;

  @Field({ nullable: true })
  branch: string;

  @Field({ nullable: true })
  jobTitle: string;

  @Field({ nullable: true })
  city: string;

  @Field({ nullable: true })
  arrivalTime: Date;

  @Field({ nullable: true })
  fatherName: string;

  @Field({ nullable: true })
  motherName: string;

  @Field({ nullable: true })
  dob: Date;

  @Field({ nullable: true })
  emergencyName: string;

  @Field({ nullable: true })
  emergencyMobile: string;

  @Field({ nullable: true })
  emergenyRelation: string;

  @Field({ nullable: true })
  canteenFacility: boolean;

  @Field({ nullable: true })
  userRemark: string;

  @Field(() => Int, {
    nullable: true,
    description: enumToString(PRICE_BASE_MODE),
  })
  selectedPaymentBase: number;

  @Field({ description: enumToString(BED_POSITION) })
  bedPosition: number;

  @Field(() => ID, { nullable: true })
  roomId: string;

  @Field(() => ID, { nullable: true })
  bedId: string;

  @Field(() => ID, { nullable: true })
  propertyId: string;

  @Field(() => ID, { nullable: true })
  invoiceId: string;

  @Field({ nullable: true })
  bedName: string;

  @Field({ nullable: true })
  contractFrom: Date;

  @Field({ nullable: true })
  contractTo: Date;

  @Field(() => Int, { nullable: true })
  totalDays: number;

  @Field(() => Int, { nullable: true })
  basePrice: number;

  @Field(() => Int, { nullable: true })
  securityDeposit: number;

  @Field(() => Int, { nullable: true })
  netAmount: number;

  @Field(() => Int, { nullable: true })
  grossAmount: number;

  @Field(() => Int, { nullable: true })
  taxAmount: number;

  @Field(() => Int, { nullable: true })
  discountAmount: number;

  @Field(() => Int, { nullable: true })
  taxPer: number;

  @Field(() => ID, { nullable: true })
  taxId: string;

  @Field(() => Int, { nullable: true })
  otherAmount: number;
}

@ObjectType()
export class BookingListResponse {
  @Field(() => [Booking], { nullable: true })
  list: Booking[];

  @Field(() => Int, { nullable: true })
  totalCount: number;
}
