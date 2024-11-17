import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Base } from './base.model';
import { AVAILABILITY_STATUS, PRICE_BASE_MODE } from './hostel.model';
import { BED_POSITION } from 'src/shared/variables/main.variable';
import { MODEL_NAMES } from '../modelNames';

export type BedDocument = HydratedDocument<Bed>;

@Schema()
export class Bed extends Base {
  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: true, default: -1, enum: BED_POSITION })
  bedPosition: number;

  @Prop({ required: true, default: 1, enum: PRICE_BASE_MODE })
  paymentBase: number;

  @Prop({ required: true, default: -1, enum: AVAILABILITY_STATUS })
  availabilityStatus: number;

  @Prop({ type: SchemaTypes.ObjectId, required: true, default: null })
  roomId: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: MODEL_NAMES.HOSTEL,
    required: true,
    default: null,
  })
  propertyId: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: MODEL_NAMES.ROOM_TYPES,
    required: true,
    default: null,
  })
  roomTypeId: string;

  @Prop({ required: false, default: '' })
  floor: string;
}

export const BedSchema = SchemaFactory.createForClass(Bed);

BedSchema.index({ name: 1, _id: 1 });
BedSchema.index({ room_id: 1 });
BedSchema.index({ roomTypeId: 1 });
BedSchema.index({ availability_status: 1 });
BedSchema.index(
  { name: 1, propertyId: 1, roomId: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);
BedSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
BedSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
BedSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
BedSchema.post('findOneAndUpdate', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
BedSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('Bed already existing'));
  } else {
    next();
  }
}
