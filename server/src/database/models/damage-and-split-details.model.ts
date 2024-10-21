import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from './base.model';
import { Field, ID, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { DamageAndSplit } from './damage-and-split.model';
import { User } from './user.model';

@ObjectType()
@Schema()
export class DamageAndSplitDetails extends Base {
  @Field(() => ID, { nullable: true })
  @Prop({ required: true })
  damageAndSplitId: string;

  @Field(() => ID, { nullable: true })
  @Prop({ required: true })
  userId: string;

  @Field({ nullable: true, defaultValue: 0 })
  @Prop({ required: true })
  amount: number;

  @Field({ nullable: true })
  @Prop({ required: false, default: 0 })
  received: number;

  @Field({ nullable: true })
  @Prop({ required: false, default: false })
  payed: boolean;

  @Field(() => DamageAndSplit, { nullable: true })
  damageAndSplit: DamageAndSplit;

  @Field(() => User, { nullable: true })
  user: User;
}

export const DamageAndSplitDetailsSchema = SchemaFactory.createForClass(
  DamageAndSplitDetails,
);

DamageAndSplitDetailsSchema.index(
  { damageAndSplitId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);
DamageAndSplitDetailsSchema.index({ userId: 1 });

DamageAndSplitDetailsSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
DamageAndSplitDetailsSchema.post(
  'insertMany',
  async function (error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
  },
);
DamageAndSplitDetailsSchema.post(
  'updateOne',
  async function (error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
  },
);
DamageAndSplitDetailsSchema.post(
  'findOneAndUpdate',
  async function (error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
  },
);
DamageAndSplitDetailsSchema.post(
  'updateMany',
  async function (error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
  },
);

function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('User already selected for this split'));
  } else {
    next();
  }
}
