import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from './base.model';

export enum DOC_TYPE {
  IMAGE = 1,
  ICON = 2,
  DOCUMENTS = 3,
  DEFAULT = -1,
}

export type GalleryDocument = HydratedDocument<Gallery>;

@Schema()
export class Gallery extends Base {
  @Prop({ default: '', required: true })
  uid: string;

  @Prop({ default: '', required: true })
  url: string;

  @Prop({ default: '' })
  name: string;

  @Prop({ type: Number, enum: DOC_TYPE, required: true, default: -1 })
  docType: number;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);

GallerySchema.index({ uid: 1, _id: 1 });
GallerySchema.index({ name: 1 });
GallerySchema.index({ docType: 1 });
GallerySchema.index({ status: 1 });
// GallerySchema.index(
//   { uid: 1 },
//   { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
// );

GallerySchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

GallerySchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

GallerySchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

GallerySchema.post('findOneAndUpdate', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

GallerySchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('Gallery item already existing'));
  } else {
    next();
  }
}
