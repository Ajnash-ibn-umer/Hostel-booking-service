import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Base } from './base.model';
import { AVAILABILITY_STATUS, PRICE_BASE_MODE } from './hostel.model';
import { MODEL_NAMES } from '../modelNames';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import enumToString from 'src/shared/utils/enumTostring';
import { User } from 'src/modules/user/entities/user.entity';
import { Hostel } from 'src/modules/booking/hostels/entities/hostel.entity';
import { Bed } from 'src/modules/booking/hostels/entities/bed.entity';
import { Room } from 'src/modules/booking/hostels/entities/room.entity';

export type CheckoutRequestDocument = HydratedDocument<CheckoutRequest>;
export enum CHECKOUT_APPROVAL_STATUS {
  PENDING = 1,
  CANCELED = 2,
  APPROVED = 3,
}

@ObjectType()
@Schema()
export class CheckoutRequest extends Base {
  @Field({ nullable: true })
  @Prop({ required: false, default: null })
  vaccatingDate: Date;

  @Field(() => String, { nullable: true })
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: MODEL_NAMES.BOOKING,
  })
  bookingId: string;

  @Field(() => String, { nullable: true })
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: MODEL_NAMES.CONTRACTS,
  })
  contractId: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: MODEL_NAMES.USER })
  guestId: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, default: '' })
  guestNo: string;

  @Field(() => Int, {
    nullable: true,
    description: enumToString(CHECKOUT_APPROVAL_STATUS),
  })
  @Prop({ required: true, default: 1, enum: CHECKOUT_APPROVAL_STATUS })
  checkoutApprovalStatus: number;

  @Field({ nullable: true })
  @Prop({ required: false, default: '' })
  description: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: MODEL_NAMES.HOSTEL })
  hostelId: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: MODEL_NAMES.ROOM })
  roomId: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: MODEL_NAMES.BED })
  bedId: string;

  @Field(() => User, { nullable: true })
  guest?: User;

  @Field(() => User, { nullable: true })
  createdUser?: User;

  @Field(() => Hostel, { nullable: true })
  hostel?: Hostel;

  @Field(() => Bed, { nullable: true })
  bed?: Bed;

  @Field(() => Room, { nullable: true })
  room?: Room;
}

export const CheckoutRequestSchema =
  SchemaFactory.createForClass(CheckoutRequest);

CheckoutRequestSchema.index({ name: 1, _id: 1 });
CheckoutRequestSchema.index({ room_id: 1 });
CheckoutRequestSchema.index({ roomTypeId: 1 });
CheckoutRequestSchema.index({ availability_status: 1 });
CheckoutRequestSchema.index(
  { userId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $lt: 2 }, checkoutApprovalStatus: 1 },
  },
);
CheckoutRequestSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
CheckoutRequestSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
CheckoutRequestSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
CheckoutRequestSchema.post(
  'findOneAndUpdate',
  async function (error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
  },
);
CheckoutRequestSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('CheckoutRequest already existing'));
  } else {
    next();
  }
}
