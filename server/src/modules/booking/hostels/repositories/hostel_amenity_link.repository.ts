import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { HostelAmenitiesLinkDocument } from 'src/database/models/join_tables/hostel_x_amenities.model';

@Injectable()
export class HostelAmenityLinksRepository extends EntityRepository<HostelAmenitiesLinkDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.HOSTEL_X_AMENITIES)
    protected HostelAmenityLinksModel: Model<HostelAmenitiesLinkDocument>,
  ) {
    super(HostelAmenityLinksModel);
  }
}
