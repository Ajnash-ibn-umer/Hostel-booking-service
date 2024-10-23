import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from './base.model';

export type AmenityDocument = HydratedDocument<Amenity>;

@Schema()
export class Amenity extends Base {
  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, default: '' })
  slug: string;

  @Prop({ default: '' })
  icon: string;
}

export const AmenitySchema = SchemaFactory.createForClass(Amenity);
AmenitySchema.index(
  { name: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $lt: 2 } },
  },
);
AmenitySchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
AmenitySchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
AmenitySchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
AmenitySchema.post('findOneAndUpdate', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
AmenitySchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('Amenity already existing'));
  } else {
    next();
  }
}
