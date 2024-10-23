import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { ContactUsDocument } from 'src/database/models/contact-us.model';

@Injectable()
export class ContactUsRepository extends EntityRepository<ContactUsDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.CONTACT_US)
    protected ContactUsModel: Model<ContactUsDocument>,
  ) {
    super(ContactUsModel);
  }
}
