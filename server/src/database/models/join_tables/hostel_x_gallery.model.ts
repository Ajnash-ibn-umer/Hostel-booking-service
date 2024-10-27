import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from '../base.model';

export enum LINK_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}

export type HostelGalleryLinkDocument = HydratedDocument<HostelGalleryLink>;

@Schema()
export class HostelGalleryLink extends Base {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  hostelId: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  galleryId: string;
}

export const HostelGalleryLinkSchema =
  SchemaFactory.createForClass(HostelGalleryLink);

HostelGalleryLinkSchema.index(
  { hostelId: 1, galleryId: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);
HostelGalleryLinkSchema.index({ status: 1 });

HostelGalleryLinkSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

HostelGalleryLinkSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

HostelGalleryLinkSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

HostelGalleryLinkSchema.post(
  'findOneAndUpdate',
  async function (error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
  },
);

HostelGalleryLinkSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('HostelGalleryLink already existing'));
  } else {
    next();
  }
}
