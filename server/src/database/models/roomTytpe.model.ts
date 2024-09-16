import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from './base.model';

export type RoomTypeDocument = HydratedDocument<RoomType>;

@Schema()
export class RoomType extends Base {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
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
