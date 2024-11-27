import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { LaundryBookingDocument } from 'src/database/models/laundry.model';

@Injectable()
export class LaundryBookingRepository extends EntityRepository<LaundryBookingDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.LAUNDRY_BOOKING)
    protected LaundryBookingModel: Model<LaundryBookingDocument>,
  ) {
    super(LaundryBookingModel);
  }
}
