import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import { MODEL_NAMES } from '../modelNames';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import enumToString from 'src/shared/utils/enumTostring';

export type BaseDocument = HydratedDocument<Base>;

@ObjectType()
@Schema()
export class Base {
  @Field(() => ID, { nullable: true })
  _id?: string | any;

  @Field(() => Int, { nullable: true, description: enumToString(STATUS_NAMES) })
  @Prop({ type: Number, enum: STATUS_NAMES })
  status?: STATUS_NAMES;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, default: null })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, default: null })
  updatedAt?: Date;

  @Field(() => ID, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.USER, default: null })
  createdUserId?: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.USER, default: null })
  updatedUserId?: string;
}

export const BaseSchema = SchemaFactory.createForClass(Base);

BaseSchema.index({ status: 1 });
