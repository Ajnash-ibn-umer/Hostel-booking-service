import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { ComplaintDocument } from 'src/database/models/complaints.model';

@Injectable()
export class ComplaintRepository extends EntityRepository<ComplaintDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.COMPLAINTS)
    protected ComplaintModel: Model<ComplaintDocument>,
  ) {
    super(ComplaintModel);
  }
}
