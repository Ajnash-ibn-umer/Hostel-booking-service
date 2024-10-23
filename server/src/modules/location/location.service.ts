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
import { ListInputLocation } from './dto/list-locaitoninput';
import { Location, LocationListResponse } from './entities/location.entity';
import { Paginate, Search } from 'src/shared/utils/mongodb/filtration.util';
import { responseFormat } from 'src/shared/graphql/queryProjection';
import { Lookup } from 'src/shared/utils/mongodb/lookupGenerator';
import { MODEL_NAMES } from 'src/database/modelNames';
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
      console.log({ createLocationInput });
      const location = await this.locationRepository.create({
        name: createLocationInput.name,
        gps_location: createLocationInput.gps_location,
        locationLink: createLocationInput.locationLink,
        status: STATUS_NAMES.ACTIVE,
        createdAt: time,
        createdUserId: userId,
      });
      console.log({ location });
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
        {
          ...dto,
          updatedAt: time,
          updatedUserId: userId,
        },
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
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async list(
    dto: ListInputLocation,
    projection: Record<string, any>,
  ): Promise<LocationListResponse> {
    const pipeline: any[] = [];

    if (dto.searchingText && dto.searchingText !== '') {
      pipeline.push(
        Search(['name', 'slug', 'name', 'description'], dto.searchingText),
      );
    }

    // Add match conditions based on dto
    if (dto.locationIds && dto.locationIds.length > 0) {
      pipeline.push({
        $match: {
          _id: {
            $in: dto.locationIds.map((id) => new mongoose.Types.ObjectId(id)),
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
    const list = (await this.locationRepository.aggregate(
      pipeline,
    )) as Location[];
    console.log(list);
    const totalCount = await this.locationRepository.totalCount(pipeline);
    return {
      list,
      totalCount: totalCount,
    };
  }
}
