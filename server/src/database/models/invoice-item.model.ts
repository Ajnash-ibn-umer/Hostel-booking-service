import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from './base.model';
import { MODEL_NAMES } from '../modelNames';

export type InvoiceItemDocument = HydratedDocument<InvoiceItem>;
export enum INOVICE_ITEM_TYPE {
  BOOKING = 1,
  RENT = 2,
  LAUNDRY = 3,
  DAMAGE_SPLITTING = 4,
  OTHER = 5,
}

@Schema()
export class InvoiceItem extends Base {
  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.INVOICES, index: true })
  invoiceId: string;

  @Prop({ required: true, default: 1, enum: INOVICE_ITEM_TYPE, index: true })
  invoiceType: number;

  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: String, default: '' })
  refId: string;

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
}

export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);
