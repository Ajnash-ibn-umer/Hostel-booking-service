import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Base } from './base.model';
import { BOOKING_STATUS } from './booking.model';

export type BookingStatusHistoryDocument =
  HydratedDocument<BookingStatusHistory>;

@Schema()
export class BookingStatusHistory extends Base {
  @Prop({ required: true, type: SchemaTypes.ObjectId })
  bookingId: string;

  @Prop({ required: true, enum: BOOKING_STATUS, default: 1 })
  bookingStatus: number;

  @Prop({ required: false, default: '' })
  description: string;
}

export const BookingStatusHistorySchema =
  SchemaFactory.createForClass(BookingStatusHistory);

BookingStatusHistorySchema.index({ bookingId: 1, bookingStatus: 1 });
