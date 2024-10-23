import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { DamageAndSplitDocument } from 'src/database/models/damage-and-split.model';

@Injectable()
export class DamageAndSplitRepository extends EntityRepository<DamageAndSplitDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.DAMAGE_AND_SPLIT)
    protected DamageAndSplitModel: Model<DamageAndSplitDocument>,
  ) {
    super(DamageAndSplitModel);
  }
}
