import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { BedDocument } from 'src/database/models/bed.model';
import { LocationDocument } from 'src/database/models/location.model';

@Injectable()
export class LocationRepository extends EntityRepository<LocationDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.LOCATION)
    protected LocationModel: Model<LocationDocument>,
  ) {
    super(LocationModel);
  }
}
