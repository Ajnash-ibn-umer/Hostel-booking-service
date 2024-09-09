import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { AmenityDocument } from 'src/database/models/amenity.model';

@Injectable()
export class AmenityRepository extends EntityRepository<AmenityDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.AMENITIES)
    protected AmenityModel: Model<AmenityDocument>,
  ) {
    super(AmenityModel);
  }
}
