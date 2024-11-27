import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from './base.model';
import { MODEL_NAMES } from '../modelNames';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import enumToString from 'src/shared/utils/enumTostring';

export type ContractDocument = HydratedDocument<Contract>;

export enum VACCATE_STATUS {
  IN_CONTRACT = 1,
  VACCATE_PENDING = 2,
  VACCATED = 3,
}

@ObjectType()
@Schema()
export class Contract extends Base {
  @Field(() => ID, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.USER })
  userId: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.BOOKING })
  bookingId: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.ROOM })
  roomId: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.BED })
  bedId: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.HOSTEL })
  propertyId: string;

  @Field(() => Date, { nullable: true })
  @Prop({ required: true, type: Date })
  contractFrom: Date;

  @Field(() => Date, { nullable: true })
  @Prop({ required: false, type: Date })
  contractTo: Date;

  @Field(() => Int, {
    nullable: true,
    description: enumToString(VACCATE_STATUS),
  })
  @Prop({ type: Number, required: false, default: 1, enum: VACCATE_STATUS })
  vaccatStatus: number;

  @Field(() => Int, { nullable: true })
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
