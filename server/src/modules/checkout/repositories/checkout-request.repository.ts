import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { CheckoutRequestDocument } from 'src/database/models/checkout-request.model';

@Injectable()
export class CheckoutRequestRepository extends EntityRepository<CheckoutRequestDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.CHECKOUT_REQUEST)
    protected CheckoutRequestModel: Model<CheckoutRequestDocument>,
  ) {
    super(CheckoutRequestModel);
  }
}
