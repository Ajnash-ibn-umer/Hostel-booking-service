import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from './base.model';
import { Field, ID, Int, ObjectType, PartialType } from '@nestjs/graphql';
import enumToString from 'src/shared/utils/enumTostring';

export enum PaymentStatus {
  PENDING = 0,
  PAYED = 1,
}
export enum VOUCHER_TYPE {
  RENT = 1,
  LAUNDRY = 2,
  DAMAGE_AND_SPLIT = 3,
  OTHER = 4,
}

export type PaymentDocument = HydratedDocument<Payment>;

@ObjectType()
@Schema()
export class Payment extends Base {
  @Field(() => Int, { nullable: true, description: enumToString(VOUCHER_TYPE) })
  @Prop({ required: true, enum: VOUCHER_TYPE, default: 4 })
  voucherType: number;

  @Field({ nullable: true })
  @Prop({ required: false, default: null })
  dueDate: Date;

  @Field({ nullable: true })
  @Prop({ required: false, default: null })
  payedDate: Date;

  @Field(() => ID)
  @Prop({ required: false, default: null })
  voucherId: string;

  @Field({ nullable: true })
  @Prop({ required: true })
  payAmount: number;

  @Field({ nullable: true })
  @Prop({ required: false, default: 0 })
  receivedAmount: number;

  @Field(() => Int, {
    nullable: true,
    description: enumToString(PaymentStatus),
  })
  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Field(() => ID, { nullable: true })
  @Prop({ required: false, ref: 'Invoice' })
  invoiceId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index({ invoiceId: 1 });
PaymentSchema.index({ voucherType: 1 });
PaymentSchema.index({ voucherType: 1, voucherId: 1 });
