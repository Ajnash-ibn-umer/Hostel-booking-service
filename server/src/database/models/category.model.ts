import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from './base.model';

export enum CATEGORY_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category extends Base {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, default: '' })
  slug: string;

  @Prop({ default: '' })
  icon: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index(
  { name: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $lt: 2 } },
  },
);

CategorySchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
CategorySchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
CategorySchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
CategorySchema.post('findOneAndUpdate', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
CategorySchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('Amenity already existing'));
  } else {
    next();
  }
}
