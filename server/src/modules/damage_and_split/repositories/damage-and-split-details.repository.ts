import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { DamageAndSplitDetailsDocument } from 'src/database/models/damage-and-split-details.model';
@Injectable()
export class DamageAndSplitDetailsRepository extends EntityRepository<DamageAndSplitDetailsDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.DAMAGE_AND_SPLIT_DETAILS)
    protected DamageAndSplitDetailsModel: Model<DamageAndSplitDetailsDocument>,
  ) {
    super(DamageAndSplitDetailsModel);
  }
}
