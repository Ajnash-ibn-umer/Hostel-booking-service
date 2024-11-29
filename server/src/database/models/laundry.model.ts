import mongoose, {
  HydratedDocument,
  modelNames,
  SchemaType,
  SchemaTypes,
} from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Base } from './base.model';
import { MODEL_NAMES } from '../modelNames';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/user/entities/user.entity';
import { Hostel } from 'src/modules/booking/hostels/entities/hostel.entity';

export type LaundryBookingDocument = HydratedDocument<LaundryBooking>;

export enum LAUNDRY_REQUEST_STATUS {
  APPROVED = 1,
  PENDING = 2,
  REJECTED = 3,
}

export enum LAUNDRY_BOOKING_TYPE {
  FREE = 1,
  PAYED = 2,
}

@ObjectType()
@Schema()
export class LaundryBooking extends Base {
  @Field(() => Date, { nullable: true })
  @Prop({ required: true })
  bookingDate: Date;

  @Field(() => Int, { nullable: true })
  @Prop({ required: false })
  timeSlot: number;

  @Field(() => Int, {
    nullable: true,
    description: '1=approved 2=pending 3=rejected',
  })
  @Prop({ required: true, enum: LAUNDRY_REQUEST_STATUS, default: 1 })
  requestStatus: number;

  @Field(() => Int, {
    nullable: true,
    description: '1=free ,2=payed',
  })
  @Prop({ required: true, enum: LAUNDRY_BOOKING_TYPE, default: 1 })
  bookingType: number;

  @Field(() => ID, { nullable: true })
  @Prop({
    required: false,
    ref: MODEL_NAMES.USER,
    type: SchemaTypes.ObjectId,
    default: null,
  })
  userId?: string;

  @Field(() => ID, { nullable: true })
  @Prop({
    required: false,
    type: mongoose.Types.ObjectId,
    ref: MODEL_NAMES.HOSTEL,
    default: null,
  })
  hostelId?: string;

  @Field(() => User, { nullable: true })
  createdUser?: User;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => User, { nullable: true })
  updatedUser?: User;

  @Field(() => Hostel, { nullable: true })
  hostel?: Hostel;
}

export const LaundryBookingSchema =
  SchemaFactory.createForClass(LaundryBooking);

LaundryBookingSchema.index({ bookingDate: 1 });
LaundryBookingSchema.index({ timeSlot: 1 });
LaundryBookingSchema.index({ requestStatus: 1 });
LaundryBookingSchema.index({ bookingType: 1 });

LaundryBookingSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
LaundryBookingSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
LaundryBookingSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
LaundryBookingSchema.post(
  'findOneAndUpdate',
  async function (error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
  },
);
LaundryBookingSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('LaundryBooking already existing'));
  } else {
    next();
  }
}
