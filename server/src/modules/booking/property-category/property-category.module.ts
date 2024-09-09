import { Module } from '@nestjs/common';
import { PropertyCategoryService } from './property-category.service';
import { PropertyCategoryResolver } from './property-category.resolver';
import { PropertyCategoryRepository } from './repositories/property-category.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelDefinitions } from 'src/database/modelDefinitions';

@Module({
  providers: [
    PropertyCategoryResolver,
    PropertyCategoryService,
    PropertyCategoryRepository,
  ],
  imports: [MongooseModule.forFeature([ModelDefinitions.categoryModel])],
})
export class PropertyCategoryModule {}
