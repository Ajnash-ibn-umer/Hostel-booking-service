import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { InvoiceItemDocument } from 'src/database/models/invoice-item.model';

@Injectable()
export class InvoiceItemRepository extends EntityRepository<InvoiceItemDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.INVOICE_ITEMS)
    protected InvoiceItemModel: Model<InvoiceItemDocument>,
  ) {
    super(InvoiceItemModel);
  }
}
