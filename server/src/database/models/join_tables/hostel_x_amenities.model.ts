import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from '../base.model';

export enum LINK_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}

export type HostelAmenitiesLinkDocument = HydratedDocument<HostelAmenitiesLink>;

@Schema()
export class HostelAmenitiesLink extends Base {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  hostelId: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  amenityId: string;
}

export const HostelAmenitiesLinkSchema =
  SchemaFactory.createForClass(HostelAmenitiesLink);

HostelAmenitiesLinkSchema.index(
  { hostelId: 1, amenityId: 1 },
  { unique: true },
);
HostelAmenitiesLinkSchema.index({ status: 1 });

HostelAmenitiesLinkSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

HostelAmenitiesLinkSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

HostelAmenitiesLinkSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

HostelAmenitiesLinkSchema.post(
  'findOneAndUpdate',
  async function (error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
  },
);

HostelAmenitiesLinkSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('HostelAmenitiesLink already existing'));
  } else {
    next();
  }
}
