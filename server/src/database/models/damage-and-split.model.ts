import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from './base.model';
import { Field, ID, Int, ObjectType, PartialType } from '@nestjs/graphql';
import enumToString from 'src/shared/utils/enumTostring';
import { Hostel } from 'src/modules/booking/hostels/entities/hostel.entity';

export enum AmountStatus {
  PAYMENT_PENDING = 0,
  PARTIALY_PAID = 1,
  FULLY_PAID = 2,
}

export type DamageAndSplitDocument = HydratedDocument<DamageAndSplit>;

@ObjectType()
@Schema()
export class DamageAndSplit extends Base {
  @Field(() => ID, { nullable: true })
  @Prop({ required: true })
  hostelId: string;

  @Field({ nullable: true })
  @Prop({ required: true, index: true })
  title: string;

  @Field({ nullable: true })
  @Prop({ required: false, default: '' })
  description: string;

  @Field({ nullable: true })
  @Prop({ required: false, default: null })
  documentUrl: string;

  @Field({ nullable: true })
  @Prop({ required: false, default: 0 })
  totalAmount: number;

  @Field({ nullable: true })
  @Prop({ required: false, default: 0 })
  receivedAmount: number;

  @Field({ nullable: true })
  @Prop({ required: false, default: null })
  dueDate: Date;

  @Field(() => Int, { nullable: true, description: enumToString(AmountStatus) })
  @Prop({ enum: AmountStatus, default: AmountStatus.PAYMENT_PENDING })
  amountStatus: AmountStatus;

  @Field(() => Hostel, { nullable: true })
  hostel: Hostel;
}

export const DamageAndSplitSchema =
  SchemaFactory.createForClass(DamageAndSplit);

DamageAndSplitSchema.index({ hostelId: 1, _id: 1 });
