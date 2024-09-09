import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAmenityInput } from './dto/create-amenity.input';
import { UpdateAmenityInput } from './dto/update-amenity.input';
import { AmenityRepository } from './repositories/amenity.repository';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { GraphQLError } from 'graphql';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import { generateSlug } from 'src/shared/utils/slug_gen';
@Injectable()
export class AmenitiesService {
  constructor(
    private readonly amenityRepository: AmenityRepository,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}

  async create(dto: CreateAmenityInput, userId: string) {
    const time = new Date();
    try {
      const amenity = await this.amenityRepository.create({
        ...dto,
        slug: generateSlug(dto.name),
        status: STATUS_NAMES.ACTIVE,
        createdAt: time,
        createdUserId: userId,
      });

      if (!amenity) {
        throw 'Amenity creation failed';
      }
      return amenity;
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async update(dto: UpdateAmenityInput, userId: string) {
    const time = new Date();
    try {
      const amenity = await this.amenityRepository.findOneAndUpdate(
        { _id: dto._id },
        {
          ...dto,
          slug: generateSlug(dto.name),

          updatedAt: time,
          updatedUserId: userId,
        },
      );

      if (!amenity) {
        throw 'Amenity update failed';
      }
      return amenity;
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
      const result = await this.amenityRepository.updateMany(
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
        message: 'Amenity status updated successfully',
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
