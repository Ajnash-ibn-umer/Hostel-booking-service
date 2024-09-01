import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Base } from './base.model';
import { USER_TYPES } from 'src/shared/variables/main.variable';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Base {
  @Prop({ default: '', required: true })
  userNo?: string;

  @Prop({ default: '', required: true })
  name?: string;

  @Prop({ default: '', required: false })
  email?: string;

  @Prop({ default: '', required: false })
  password?: string;

  @Prop({ default: '', required: false })
  phoneNumber?: string;

  @Prop({ type: Number, enum: USER_TYPES, default: -1 })
  userType?: number;

  @Prop({ type: SchemaTypes.ObjectId, default: null })
  roleId?: string;

  @Prop({ type: String, default: '' })
  profileImgUrl?: string;

  @Prop({ type: SchemaTypes.ObjectId, default: null })
  bookingId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ name: 1, _id: 1 });
UserSchema.index({ userNo: 1 });
UserSchema.index({ phoneNumber: 1, _id: 1 });
UserSchema.index({ email: 1, _id: 1 });

UserSchema.index({ _userType: 1 });

UserSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);
UserSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);
UserSchema.index(
  { phoneNumber: 1 },
  { unique: true, partialFilterExpression: { status: { $lt: 2 } } },
);
UserSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
UserSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
UserSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
UserSchema.post('findOneAndUpdate', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
UserSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('User already existing'));
  } else {
    next();
  }
}
// status 0 : default ,1: active,2: inactive
