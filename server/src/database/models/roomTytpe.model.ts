import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from './base.model';

export type RoomTypeDocument = HydratedDocument<RoomType>;

@Schema()
export class RoomType extends Base {
  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: false, default: '' })
  description: string;

  @Prop({ required: true, default: 0 })
  bedCount: number;

  @Prop({ required: false, default: 0 })
  securityDepositForLower: number;

  @Prop({ required: false, default: 0 })
  securityDepositForUpper: number;

  @Prop({ required: true, default: 0 })
  rentMonthlyUpper: number;

  @Prop({ required: true, default: 0 })
  rentMonthlyLower: number;

  @Prop({ required: true, default: 0 })
  rentDailyLower: number;

  @Prop({ required: true, default: 0 })
  rentDailyUpper: number;
}

export const RoomTypeSchema = SchemaFactory.createForClass(RoomType);

RoomTypeSchema.index({ name: 1, _id: 1 });
RoomTypeSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);

RoomTypeSchema.index({ status: 1 });

RoomTypeSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

RoomTypeSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

RoomTypeSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

RoomTypeSchema.post('findOneAndUpdate', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

RoomTypeSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('RoomType already existing'));
  } else {
    next();
  }
}
