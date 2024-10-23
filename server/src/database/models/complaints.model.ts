import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from './base.model';
import { MODEL_NAMES } from '../modelNames';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/user/entities/user.entity';
import enumToString from 'src/shared/utils/enumTostring';
import { Hostel } from 'src/modules/booking/hostels/entities/hostel.entity';
import { Room } from 'src/modules/booking/hostels/entities/room.entity';
import { Gallery } from 'src/modules/gallery/entities/gallery.entity';

export type ComplaintDocument = HydratedDocument<Complaint>;

export enum REQUEST_STATUS {
  REQUEST_SENT = 0,
  PENDING = 1,
  REJECTED = 2,
  ACTION_TAKEN = 3,
}

@ObjectType()
@Schema()
export class Complaint extends Base {
  @Field(() => ID, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.USER })
  userId: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.HOSTEL })
  propertyId: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.ROOM })
  roomId: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: true, index: true })
  title: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: true })
  description: string;

  @Field(() => Int, {
    nullable: true,
    description: enumToString(REQUEST_STATUS),
  })
  @Prop({ type: Number, required: false, default: 1, enum: REQUEST_STATUS })
  requestStatus: number;

  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => Hostel, { nullable: true })
  property: Hostel;

  @Field(() => Room, { nullable: true })
  room: Room;

  @Field(() => [Gallery], { nullable: true })
  galleries: Gallery[];
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);

ComplaintSchema.index({ userId: 1 });
