import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { PaymentDocument } from 'src/database/models/payments.model';

@Injectable()
export class PaymentsRepository extends EntityRepository<PaymentDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.PAYMENTS)
    protected paymentsModel: Model<PaymentDocument>,
  ) {
    super(paymentsModel);
  }
}
