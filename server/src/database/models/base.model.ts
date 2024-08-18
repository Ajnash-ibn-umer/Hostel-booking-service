import mongoose, { Model } from 'mongoose';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import { MODEL_NAMES } from '../modelNames';
import { HydratedDocument,SchemaTypes } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

export type BaseDocument = HydratedDocument<Base>;

@Schema()
export class Base {
  @Prop({type:Number,enum:STATUS_NAMES})
  status?: STATUS_NAMES;

  @Prop({default:null})
  createdAt?: Date;

  @Prop({default:null})
  updatedAt?: Date;

  @Prop({ type:  SchemaTypes.ObjectId, ref: MODEL_NAMES.USER,default:null })
  createdUserId?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.USER ,default:null})
  updatedUserId?: string;
}

export const BaseSchema = SchemaFactory.createForClass(Base);

BaseSchema.index({ status: 1 });