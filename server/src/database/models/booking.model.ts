import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, HydratedDocument } from 'mongoose';
import { Base } from './base.model';
import { BED_POSITION } from 'src/shared/variables/main.variable';
import { MODEL_NAMES } from '../modelNames';

export enum BOOKING_STATUS {
  INIT = 1,
  FORM_COMPLETED = 2,
  PAYMENT_FAILED = 3,
  PAYMENT_SUCCESS = 4,
  ADMIN_APPROVED = 5,
  CHECK_IN = 6,
}

export type BookingDocument = HydratedDocument<Booking>;

@Schema()
export class Booking extends Base {
  @Prop({ default: 1, enum: BOOKING_STATUS, required: true })
  bookingStatus: number;

  @Prop({ default: '', required: true, index: true })
  name: string;

  @Prop({ default: '', required: false, index: true })
  email: string;

  @Prop({ default: '', required: true, index: true })
  phone: string;

  @Prop({ default: '', required: true, index: true })
  bookingNumber: string;

  @Prop({ default: '' })
  regNo: string;

  @Prop({ type: Boolean, default: false })
  laudryFacility: boolean;

  @Prop({ default: '' })
  idCardNumber: string;

  @Prop({ default: '' })
  companyName: string;

  @Prop({ default: '' })
  branch: string;

  @Prop({ default: '' })
  jobTitle: string;

  @Prop({ default: '' })
  city: string;

  @Prop({ default: '' })
  address: string;

  @Prop({ default: null })
  arrivalTime: Date;

  @Prop({ default: '' })
  idProofDocUrl?: string;

  @Prop({ default: '' })
  fatherName: string;

  @Prop({ default: '' })
  motherName: string;

  @Prop({ type: Date, default: null })
  dob: Date;

  @Prop({ default: '' })
  emergencyName: string;

  @Prop({ default: '' })
  emergencyMobile: string;

  @Prop({ default: '' })
  emergenyRelation: string;

  @Prop({ default: '' })
  bloodGroup: string;

  @Prop({ default: false })
  canteenFacility: boolean;

  @Prop({ default: '' })
  userRemark: string;

  //   ----
  @Prop({ default: 0 })
  selectedPaymentBase: number;

  @Prop({
    type: SchemaTypes.ObjectId,
    default: null,
    ref: MODEL_NAMES.ROOM,
    required: true,
    index: true,
  })
  roomId: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    default: null,
    index: true,
    ref: MODEL_NAMES.BED,
  })
  bedId: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    default: null,
    required: true,
    index: true,
    ref: MODEL_NAMES.HOSTEL,
  })
  propertyId: string;

  @Prop({ type: SchemaTypes.ObjectId, default: null, ref: MODEL_NAMES.INVOICE })
  invoiceId: string;

  @Prop({ default: '' })
  bedName: string;

  @Prop({ default: new Date() })
  contractFrom: Date;

  @Prop({ default: new Date() })
  contractTo: Date;

  @Prop({ type: Date, default: null })
  checkInDate: Date;

  @Prop({ required: true, default: -1, enum: BED_POSITION })
  bedPosition: number;

  @Prop({ default: 0 })
  totalDays: number;

  @Prop({ default: 0 })
  basePrice: number;

  @Prop({ default: 0 })
  securityDeposit: number;

  @Prop({ default: 0 })
  netAmount: number;

  @Prop({ default: 0 })
  grossAmount: number;

  @Prop({ default: 0 })
  taxAmount: number;

  @Prop({ default: 0 })
  discountAmount: number;

  @Prop({ default: 0 })
  taxPer: number;

  @Prop({ type: SchemaTypes.ObjectId, default: null })
  taxId: string;

  @Prop({ default: 0 })
  otherAmount: number;

  @Prop({ default: 0 })
  version: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
