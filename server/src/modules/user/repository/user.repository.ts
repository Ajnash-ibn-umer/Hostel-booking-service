import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { User, UserDocument } from 'src/database/models/user.model';

@Injectable()
export class UserRepository extends EntityRepository<UserDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.USER) protected userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
