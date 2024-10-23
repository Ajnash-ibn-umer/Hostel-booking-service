import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { RoomDocument } from 'src/database/models/room.model';

@Injectable()
export class RoomRepository extends EntityRepository<RoomDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.ROOM) protected RoomModel: Model<RoomDocument>,
  ) {
    super(RoomModel);
  }
}
