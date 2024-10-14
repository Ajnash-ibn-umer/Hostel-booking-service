import { Field, ID, InputType } from '@nestjs/graphql';
import { PRICE_BASE_MODE } from 'src/database/models/hostel.model';
import enumToString from 'src/shared/utils/enumTostring';
import { BED_POSITION } from 'src/shared/variables/main.variable';

@InputType()
export class BookingCreateInput {
  @Field({ description: 'Name of the person booking' })
  name: string;

  @Field({ description: 'Email of the person booking' })
  email: string;

  @Field({ description: 'Phone number of the person booking' })
  phone: string;

  @Field({ description: 'Registration Number', nullable: true })
  regNo?: string;

  @Field({ description: 'ID Card Number', nullable: true })
  idCardNumber?: string;

  @Field({ description: 'Company Name', nullable: true })
  companyName?: string;

  @Field({ description: 'Branch', nullable: true })
  branch?: string;

  @Field({ description: 'Job Title', nullable: true })
  jobTitle?: string;

  @Field({ description: 'City', nullable: true })
  city?: string;

  @Field({ description: 'Blood Group', nullable: true })
  bloodGroup?: string;

  @Field({ description: 'Address', nullable: true })
  address?: string;

  @Field(() => Date, { description: 'Arrival Time', nullable: true })
  arrivalTime?: Date;

  @Field({ description: "Father's Name", nullable: true })
  fatherName?: string;

  @Field({ description: "Mother's Name", nullable: true })
  motherName?: string;

  @Field(() => Date, { description: 'Date of Birth', nullable: true })
  dob?: Date;

  @Field({ description: 'Emergency Contact Name', nullable: true })
  emergencyName?: string;

  @Field({ description: 'Emergency Contact Mobile', nullable: true })
  emergencyMobile?: string;

  @Field({ description: 'Emergency Contact Relation', nullable: true })
  emergenyRelation?: string;

  @Field(() => Boolean, { description: 'Canteen Facility', nullable: true })
  canteenFacility?: boolean;

  @Field(() => Boolean, { description: 'Laundry Facility', nullable: true })
  laudryFacility?: boolean;

  @Field({ description: 'User Remark', nullable: true })
  userRemark?: string;

  @Field(() => Number, { description: 'Selected Payment Base' })
  selectedPaymentBase: number;

  @Field({ description: enumToString(BED_POSITION) })
  bedPosition: number;

  @Field(() => ID, { description: 'Room ID' })
  roomId: string;

  @Field(() => ID, { description: 'Bed ID' })
  bedId: string;

  @Field(() => ID, { description: 'Property ID' })
  propertyId: string;

  @Field({ description: 'Bed Name' })
  bedName: string;

  @Field(() => Date, { description: 'Contract From', nullable: true })
  contractFrom?: Date;

  @Field(() => Date, { description: 'Contract To', nullable: true })
  contractTo?: Date;

  @Field(() => Number, { description: 'Total Days' })
  totalDays: number;

  @Field(() => Number, { description: 'Base Price' })
  basePrice: number;

  @Field(() => Number, { description: 'Security Deposit' })
  securityDeposit: number;

  @Field(() => Number, { description: 'Net Amount' })
  netAmount: number;

  @Field(() => Number, { description: 'Gross Amount' })
  grossAmount: number;

  @Field(() => Number, { description: 'Tax Amount' })
  taxAmount: number;

  @Field(() => Number, { description: 'Discount Amount' })
  discountAmount: number;

  @Field(() => Number, { description: 'Tax Percentage', nullable: true })
  taxPer?: number;

  @Field(() => ID, { description: 'Tax ID', nullable: true })
  taxId?: string;

  @Field(() => Number, { description: 'Other Amount', nullable: true })
  otherAmount?: number;

  @Field(() => String, { description: 'ID Proof Document', nullable: true })
  idProofDocUrl?: string;
}
