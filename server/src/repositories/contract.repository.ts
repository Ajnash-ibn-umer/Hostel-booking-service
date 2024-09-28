import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { ContractDocument } from 'src/database/models/contract.model';

@Injectable()
export class ContractRepository extends EntityRepository<ContractDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.CONTRACTS)
    protected ContractModel: Model<ContractDocument>,
  ) {
    super(ContractModel);
  }
}
