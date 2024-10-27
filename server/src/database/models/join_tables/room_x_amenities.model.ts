import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from '../base.model';

export enum LINK_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}

export type RoomAmenitiesLinkDocument = HydratedDocument<RoomAmenitiesLink>;

@Schema()
export class RoomAmenitiesLink extends Base {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  roomId: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  amenityId: string;
}

export const RoomAmenitiesLinkSchema =
  SchemaFactory.createForClass(RoomAmenitiesLink);

RoomAmenitiesLinkSchema.index(
  { roomId: 1, amenityId: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);
RoomAmenitiesLinkSchema.index({ status: 1 });

RoomAmenitiesLinkSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

RoomAmenitiesLinkSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

RoomAmenitiesLinkSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

RoomAmenitiesLinkSchema.post(
  'findOneAndUpdate',
  async function (error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
  },
);

RoomAmenitiesLinkSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('RoomAmenitiesLink already existing'));
  } else {
    next();
  }
}
