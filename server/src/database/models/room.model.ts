import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Base } from './base.model';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room extends Base {
  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: true, default: '' })
  slug: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true, default: null })
  roomTypeId: string;

  @Prop({ required: false, default: '' })
  floor: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true, default: null })
  propertyId: string;

  @Prop({ required: true, default: 0 })
  totalBeds: number;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.index({ name: 1 });
RoomSchema.index({ slug: 1, _id: 1 });

RoomSchema.index({ property_id: 1 });
RoomSchema.index(
  { propertyId: 1, name: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);

RoomSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
RoomSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
RoomSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
RoomSchema.post('findOneAndUpdate', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
RoomSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('Room already existing'));
  } else {
    next();
  }
}
