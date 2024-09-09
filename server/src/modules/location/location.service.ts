import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { LocationRepository } from './repositories/location.repository';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { GraphQLError } from 'graphql';
import { dot } from 'node:test/reporters';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
@Injectable()
export class LocationService {
  constructor(
    private readonly locationRepository: LocationRepository,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}
  async create(createLocationInput: CreateLocationInput, userId: string) {
    const time = new Date();
    try {
      const location = await this.locationRepository.create({
        ...createLocationInput,
        status: STATUS_NAMES.ACTIVE,
        createdAt: time,
        createdUserId: userId,
      });

      if (!location) {
        throw 'Location creation failed';
      }
      return location;
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async update(dto: UpdateLocationInput, userId: string) {
    const time = new Date();
    try {
      const location = await this.locationRepository.findOneAndUpdate(
        { _id: dto._id },
        { ...dto, updatedAt: time, updatedUserId: userId },
      );

      if (!location) {
        throw 'Location update failed';
      }
      return location;
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
      const result = await this.locationRepository.updateMany(
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
        message: 'Location status updated successfully',
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
