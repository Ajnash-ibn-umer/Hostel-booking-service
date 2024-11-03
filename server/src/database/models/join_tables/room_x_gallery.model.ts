import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from '../base.model';

export enum LINK_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}

export type RoomGalleryLinkDocument = HydratedDocument<RoomGalleryLink>;

@Schema()
export class RoomGalleryLink extends Base {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  roomId: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  galleryId: string;
}

export const RoomGalleryLinkSchema =
  SchemaFactory.createForClass(RoomGalleryLink);

RoomGalleryLinkSchema.index(
  { roomId: 1, galleryId: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);
RoomGalleryLinkSchema.index({ status: 1 });

RoomGalleryLinkSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

RoomGalleryLinkSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

RoomGalleryLinkSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

RoomGalleryLinkSchema.post(
  'findOneAndUpdate',
  async function (error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
  },
);

RoomGalleryLinkSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc: any, next) {
  if (error.code == 11000) {
    next(new Error(('RoomGalleryLink already existing ' + error) as any));
  } else {
    next();
  }
}
