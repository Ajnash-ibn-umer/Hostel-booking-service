import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from './base.model';

export enum AVAILABILITY_STATUS {
  DEFAULT = -1,
  AVAILABLE = 0,
  ENGAGED = 1, // for temperary
  OCCUPIED = 2, // occuppied by another person
  NOT_AVAILABLE = 3, //not available for other reason
}

export enum PRICE_BASE_MODE {
  DEFAULT = -1,
  DAILY = 1,
  MONTHLY = 2,
  BOTH = 3,
}

export type HostelDocument = HydratedDocument<Hostel>;

@Schema()
export class Hostel extends Base {
  @Prop({ required: true, unique: true, default: '' })
  name: string;

  @Prop({ required: true, unique: true, default: '' })
  propertyNo: string;

  @Prop({ required: true, default: '' })
  slug: string;

  @Prop({ default: '' })
  shortDescription: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: Number, default: -1, enum: AVAILABILITY_STATUS })
  availabilityStatus: number;

  @Prop({ type: SchemaTypes.ObjectId, default: null })
  locationId: string;

  @Prop({ type: SchemaTypes.ObjectId, default: null })
  categoryId: string;

  @Prop({ type: Number, default: 0 })
  totalRooms: number;

  @Prop({ type: Number, default: 0 })
  totalBeds: number;

  @Prop({ type: Number, default: 0 })
  sellingPrice: number;

  @Prop({ type: Number, default: 0 })
  standardPrice: number;

  @Prop({ type: Number, required: true, enum: PRICE_BASE_MODE, default: 0 })
  priceBaseMode: number;
}

export const HostelSchema = SchemaFactory.createForClass(Hostel);

HostelSchema.index({ name: 1, _id: 1 });
HostelSchema.index({ propertyNo: 1 });
HostelSchema.index({ slug: 1 });
HostelSchema.index({ availabilityStatus: 1 });
HostelSchema.index({ locationId: 1 });
HostelSchema.index({ categoryId: 1 });
HostelSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);
HostelSchema.index(
  { propertyNo: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);

HostelSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

HostelSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

HostelSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

HostelSchema.post('findOneAndUpdate', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

HostelSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('Hostel already existing'));
  } else {
    next();
  }
}
