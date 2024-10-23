import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from './base.model';

export enum PAYMENT_STATUS {
  PENDING = 0,
  SUCCESS = 1,
  FAILED = 2,
}

export enum PAYMENT_TYPE {
  CASH = 0,
  CARD = 1,
  ONLINE = 2,
}

export type PaymentTransactionDocument = HydratedDocument<PaymentTransaction>;

@Schema()
export class PaymentTransaction extends Base {
  @Prop({ required: true, default: '', index: true })
  transactionId: string;

  @Prop({ default: '' })
  remark: string;

  @Prop({ required: true, default: 0 })
  amount: number;

  @Prop({ required: true, default: PAYMENT_STATUS.PENDING, index: true })
  paymentStatus: PAYMENT_STATUS;

  @Prop({ required: true, default: PAYMENT_TYPE.CASH })
  paymentType: PAYMENT_TYPE;

  @Prop({ type: SchemaTypes.ObjectId, index: true })
  invoiceId: string;
}

export const PaymentTransactionSchema =
  SchemaFactory.createForClass(PaymentTransaction);
