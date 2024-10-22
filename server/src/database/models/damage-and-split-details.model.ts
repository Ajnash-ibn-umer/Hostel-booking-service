import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from './base.model';
import { Field, ID, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { DamageAndSplit } from './damage-and-split.model';
import { User } from 'src/modules/user/entities/user.entity';
import { Payment } from './payments.model';

@ObjectType()
@Schema()
export class DamageAndSplitDetails extends Base {
  @Field(() => ID, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  damageAndSplitId: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  userId: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, required: false, default: null })
  paymentId: string;

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

  @Field(() => Payment, { nullable: true })
  payment: Payment;
}

export const DamageAndSplitDetailsSchema = SchemaFactory.createForClass(
  DamageAndSplitDetails,
);
export type DamageAndSplitDetailsDocument =
  HydratedDocument<DamageAndSplitDetails>;

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
