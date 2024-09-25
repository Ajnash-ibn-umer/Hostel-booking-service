import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { BookingDocument } from 'src/database/models/booking.model';

@Injectable()
export class BookingRepository extends EntityRepository<BookingDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.BOOKING)
    protected BookingModel: Model<BookingDocument>,
  ) {
    super(BookingModel);
  }
}
