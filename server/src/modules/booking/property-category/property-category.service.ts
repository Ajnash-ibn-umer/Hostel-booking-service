import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePropertyCategoryInput } from './dto/create-property-category.input';
import { UpdatePropertyCategoryInput } from './dto/update-property-category.input';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PropertyCategoryRepository } from './repositories/property-category.repository';
import { GraphQLError } from 'graphql';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
import { generateSlug } from 'src/shared/utils/slug_gen';
import { ListInputCategory } from './dto/list-property-category.input';
import {
  ListCategoryResponse,
  PropertyCategory,
} from './entities/property-category.entity';
import { Paginate, Search } from 'src/shared/utils/mongodb/filtration.util';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import { TotalCount } from 'src/shared/utils/mongodb/totalCountAggregation';
import { responseFormat } from 'src/shared/graphql/queryProjection';
import { Lookup } from 'src/shared/utils/mongodb/lookupGenerator';
import { MODEL_NAMES } from 'src/database/modelNames';
@Injectable()
export class PropertyCategoryService {
  constructor(
    private readonly categoryRepository: PropertyCategoryRepository,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}

  async create(dto: CreatePropertyCategoryInput, userId: string) {
    const time = new Date();
    try {
      const category = await this.categoryRepository.create({
        ...dto,
        slug: generateSlug(dto.name),
        status: STATUS_NAMES.ACTIVE,
        createdAt: time,
        createdUserId: userId,
      });

      if (!category) {
        throw 'Category creation failed';
      }
      return category;
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async update(dto: UpdatePropertyCategoryInput, userId: string) {
    const time = new Date();
    try {
      const category = await this.categoryRepository.findOneAndUpdate(
        { _id: dto._id },
        {
          ...dto,
          slug: generateSlug(dto.name),
          updatedAt: time,
          updatedUserId: userId,
        },
      );

      if (!category) {
        throw 'Category update failed';
      }
      return category;
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async statusChange(dto: statusChangeInput, userId: string) {
    const startTime = Date.now();

    try {
      const result = await this.categoryRepository.updateMany(
        {
          _id: { $in: dto.ids },
        },
        {
          $set: {
            updatedUserId: userId,
            updatedAt: startTime,
            status: dto._status,
          },
        },
      );

      return {
        message: 'Category status updated successfully',
      };
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async listPropertyCategories(
    dto: ListInputCategory,
    projection: Record<string, any>,
  ): Promise<ListCategoryResponse> {
    const pipeline: any[] = [];

    if (dto.searchingText && dto.searchingText !== '') {
      pipeline.push(
        Search(['name', 'slug', 'name', 'description'], dto.searchingText),
      );
    }

    // Add match conditions based on dto
    if (dto.categoryIds && dto.categoryIds.length > 0) {
      pipeline.push({
        $match: {
          _id: {
            $in: dto.categoryIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      });
    }

    pipeline.push({
      $match: {
        status: {
          $in: dto.statusArray,
        },
      },
    });
    switch (dto.sortType) {
      case 0:
        pipeline.push({
          $sort: {
            createdAt: dto.sortOrder ?? 1,
          },
        });
        break;
      case 1:
        pipeline.push({
          $sort: {
            name: dto.sortOrder ?? 1,
          },
        });
        break;
      case 2:
        pipeline.push({
          $sort: {
            status: dto.sortOrder ?? 1,
          },
        });
        break;
      default:
        pipeline.push({
          $sort: {
            _id: dto.sortOrder ?? 1,
          },
        });
        break;
    }
    pipeline.push(...Paginate(dto.skip, dto.limit));
    projection && pipeline.push(responseFormat(projection['list']));
    if (projection['list']['createdUser']) {
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.USER,
          params: { id: '$createdUserId' },
          conditions: { $_id: '$$id' },
          responseName: 'createdUser',
        }),
      );
    }
    // Execute the aggregation pipeline
    const list = (await this.categoryRepository.aggregate(
      pipeline,
    )) as PropertyCategory[];
    let totalCount = 0;
    if (projection['totalCount']) {
      const totalCount = await this.categoryRepository.totalCount(pipeline);
    }
    return {
      list,
      totalCount: totalCount,
    };
  }
}
