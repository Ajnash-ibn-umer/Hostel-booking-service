import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { PaymentTransactionDocument } from 'src/database/models/transaction.model';

@Injectable()
export class TranasactionRepository extends EntityRepository<PaymentTransactionDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.TRANSACTIONS)
    protected TranasactionModel: Model<PaymentTransactionDocument>,
  ) {
    super(TranasactionModel);
  }
}
