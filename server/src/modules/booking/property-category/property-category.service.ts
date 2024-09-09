import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePropertyCategoryInput } from './dto/create-property-category.input';
import { UpdatePropertyCategoryInput } from './dto/update-property-category.input';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PropertyCategoryRepository } from './repositories/property-category.repository';
import { GraphQLError } from 'graphql';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
import { generateSlug } from 'src/shared/utils/slug_gen';
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
      return new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
}
