import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { InvoiceDocument } from 'src/database/models/invoice.model';

@Injectable()
export class InvoiceRepository extends EntityRepository<InvoiceDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.INVOICES)
    protected InvoiceModel: Model<InvoiceDocument>,
  ) {
    super(InvoiceModel);
  }
}
