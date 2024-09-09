import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { CategoryDocument } from 'src/database/models/category.model';

@Injectable()
export class PropertyCategoryRepository extends EntityRepository<CategoryDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.CATEGORY)
    protected PropertyCategoryModel: Model<CategoryDocument>,
  ) {
    super(PropertyCategoryModel);
  }
}
