import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from './base.model';

export enum LOCATION_STATUS {
  DEFAULT = -1,
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}

export type LocationDocument = HydratedDocument<Location>;

@Schema()
export class Point {
  @Prop({ type: String, enum: ['Point'] })
  type: string;

  @Prop({ type: [Number] })
  coordinates: number[];
}

@Schema()
export class Location extends Base {
  @Prop({ required: true })
  name: string;
  @Prop({ required: false })
  locationLink: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  })
  gps_location: Point;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

LocationSchema.index({ name: 1, _id: 1 });
LocationSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);

LocationSchema.index({ status: 1 });
LocationSchema.index({ gps_location: '2dsphere' });

LocationSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

LocationSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

LocationSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

LocationSchema.post('findOneAndUpdate', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

LocationSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('Location already existing'));
  } else {
    next();
  }
}
