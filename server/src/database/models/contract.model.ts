import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from './base.model';
import { MODEL_NAMES } from '../modelNames';

export type ContractDocument = HydratedDocument<Contract>;

export enum VACCATE_STATUS {
  IN_CONTRACT = 1,
  VACCATE_PENDING = 2,
  VACCATED = 3,
}
@Schema()
export class Contract extends Base {
  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.USER })
  userId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.BOOKING })
  bookingId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.ROOM })
  roomId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.BED })
  bedId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.HOSTEL })
  propertyId: string;

  @Prop({ required: true, type: Date })
  contractFrom: Date;

  @Prop({ required: false, type: Date })
  contractTo: Date;
  @Prop({ type: Number, required: false, default: 1, enum: VACCATE_STATUS })
  vaccatStatus: number;

  @Prop({ default: 0 })
  laundryMonthlyCount: number;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);

ContractSchema.index({
  userId: 1,
  bookingId: 1,
  roomId: 1,
  bedId: 1,
  propertyId: 1,
});
ContractSchema.index({ contractFrom: 1, contractTo: 1 });
ContractSchema.index(
  { userId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $lt: 2 }, vaccatStatus: { $lte: 2 } },
  },
);
ContractSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

ContractSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

ContractSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

ContractSchema.post('findOneAndUpdate', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

ContractSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('Contract already existing'));
  } else {
    next();
  }
}
