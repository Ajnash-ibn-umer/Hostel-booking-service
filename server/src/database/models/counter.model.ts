import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Base } from './base.model';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';

export type CounterDocument = HydratedDocument<Counter>;

@Schema({ toJSON: { virtuals: true } })
export class Counter {
  @Prop({ type: Number, default: 0, required: true })
  count?: number;

  @Prop({ type: String, default: '', required: true })
  entityName?: string;

  @Prop({ type: String, default: '', required: false })
  prefix?: string;

  @Prop({ type: String, default: '', required: false })
  suffix?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt?: Date;

  @Prop({ type: Number, enum: STATUS_NAMES, default: 0 })
  status?: number;

  uid: string;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);

CounterSchema.index({ entityName: 1, _id: 1 });
CounterSchema.index({ status: 1 });
CounterSchema.index(
  { entityName: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);

CounterSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.uid = ret.prefix + ret.count + ret.suffix;
    return ret;
  },
});

CounterSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

CounterSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

CounterSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
