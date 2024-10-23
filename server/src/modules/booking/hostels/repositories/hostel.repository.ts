import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { HostelDocument } from 'src/database/models/hostel.model';

@Injectable()
export class HostelRepository extends EntityRepository<HostelDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.HOSTEL)
    protected HostelModel: Model<HostelDocument>,
  ) {
    super(HostelModel);
  }
}
