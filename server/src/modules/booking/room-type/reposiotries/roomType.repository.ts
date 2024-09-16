import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { RoomTypeDocument } from 'src/database/models/roomTytpe.model';

@Injectable()
export class RoomTypeRepository extends EntityRepository<RoomTypeDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.ROOM_TYPES)
    protected RoomTypeModel: Model<RoomTypeDocument>,
  ) {
    super(RoomTypeModel);
  }
}
