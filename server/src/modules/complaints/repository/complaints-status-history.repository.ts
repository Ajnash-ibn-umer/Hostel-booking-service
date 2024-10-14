import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { ComplaintReportStatusHistoryDocument } from 'src/database/models/complaints-history.model';

@Injectable()
export class ComplaintStatusHistoryRepository extends EntityRepository<ComplaintReportStatusHistoryDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.COMPLAINTS_STATUS_HISTORY)
    protected ComplaintStatusHistoryModel: Model<ComplaintReportStatusHistoryDocument>,
  ) {
    super(ComplaintStatusHistoryModel);
  }
}
