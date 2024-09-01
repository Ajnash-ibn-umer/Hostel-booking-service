import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { BedDocument } from 'src/database/models/bed.model';

@Injectable()
export class BedRepository extends EntityRepository<BedDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.BED)
    protected BedModel: Model<BedDocument>,
  ) {
    super(BedModel);
  }
}
