import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { Counter, CounterDocument } from 'src/database/models/counter.model';

@Injectable()
export class CounterRepository extends EntityRepository<CounterDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.COUNTER) protected CounterModel: Model<CounterDocument>,
  ) {
    
    super(CounterModel);
  }
}
