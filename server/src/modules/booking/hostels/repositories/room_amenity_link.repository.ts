import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { RoomAmenitiesLinkDocument } from 'src/database/models/join_tables/room_x_amenities.model';

@Injectable()
export class RoomAmenitiesLinksRepository extends EntityRepository<RoomAmenitiesLinkDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.ROOM_X_AMENITIES)
    protected RoomAmenitiesLinksModel: Model<RoomAmenitiesLinkDocument>,
  ) {
    super(RoomAmenitiesLinksModel);
  }
}
