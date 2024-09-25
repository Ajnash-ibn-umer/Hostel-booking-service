import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { BookingDocument } from 'src/database/models/booking.model';
import { BookingStatusHistoryDocument } from 'src/database/models/booking-status.model';

@Injectable()
export class BookingStatusHistoryRepository extends EntityRepository<BookingStatusHistoryDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.BOOKING_STATUS_HISTORY)
    protected BookingStatusHistoryModel: Model<BookingStatusHistoryDocument>,
  ) {
    super(BookingStatusHistoryModel);
  }
}
