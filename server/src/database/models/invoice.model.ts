import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from './base.model';
import { MODEL_NAMES } from '../modelNames';
import { PAYMENT_STATUS, PAYMENT_TYPE } from './transaction.model';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema()
export class Invoice extends Base {
  @Prop({ required: true, default: '' })
  invoiceNo: string;

  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: true, default: '' })
  email: string;

  @Prop({ required: true, default: '' })
  phone: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.BOOKING })
  bookingId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.ROOM })
  roomId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.BED })
  bedId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.HOSTEL })
  propertyId: string;

  @Prop({ default: '' })
  bedName: string;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({ required: true, default: 0 })
  netAmount: number;

  @Prop({ required: true, default: 0 })
  grossAmount: number;

  @Prop({ required: true, default: 0 })
  taxAmount: number;

  @Prop({ required: true, default: 0 })
  discountAmount: number;

  @Prop({ required: true, default: 0 })
  taxPer: number;

  @Prop({ type: SchemaTypes.ObjectId, default: null })
  taxId: string;

  @Prop({ required: true, default: 0, enum: PAYMENT_TYPE })
  paymentType: number;

  @Prop({ required: true, default: 0, enum: PAYMENT_STATUS })
  paymentStatus: number;

  @Prop({
    type: SchemaTypes.ObjectId,
    default: null,
    ref: MODEL_NAMES.TRANSACTIONS,
  })
  paymentTransactionId: string;

  @Prop({ default: '' })
  remarks: string;

  @Prop({ default: '' })
  transactionRef: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

InvoiceSchema.index({ invoiceNo: 1 }, { unique: true });
InvoiceSchema.index({ email: 1 });
InvoiceSchema.index({ phone: 1 });
InvoiceSchema.index({ bookingId: 1 });
InvoiceSchema.index({ roomId: 1 });
InvoiceSchema.index({ bedId: 1 });
InvoiceSchema.index({ propertyId: 1 });
