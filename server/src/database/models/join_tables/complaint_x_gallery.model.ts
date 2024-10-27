import { Prop, SchemaFactory, Schema, MongooseModule } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from '../base.model';
import mongoose from 'mongoose';
export enum LINK_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}

export type ComplaintGalleryLinkDocument =
  HydratedDocument<ComplaintGalleryLink>;

@Schema()
export class ComplaintGalleryLink extends Base {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  complaintId: string | mongoose.Types.ObjectId;

  @Prop({ type: String, default: null })
  url: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  galleryId: string | mongoose.Types.ObjectId;
}

export const ComplaintGalleryLinkSchema =
  SchemaFactory.createForClass(ComplaintGalleryLink);

ComplaintGalleryLinkSchema.index(
  { complaintId: 1, galleryId: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);
ComplaintGalleryLinkSchema.index({ status: 1 });

ComplaintGalleryLinkSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

ComplaintGalleryLinkSchema.post(
  'insertMany',
  async function (error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
  },
);

ComplaintGalleryLinkSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

ComplaintGalleryLinkSchema.post(
  'findOneAndUpdate',
  async function (error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
  },
);

ComplaintGalleryLinkSchema.post(
  'updateMany',
  async function (error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
  },
);

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('ComplaintGalleryLink already existing'));
  } else {
    next();
  }
}
