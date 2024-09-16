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
import { Amenity } from './entities/amenity.entity';
import { MatchList, Paginate } from 'src/shared/utils/mongodb/filtration.util';
import { ListInpuAmenity } from './dto/list-amenity.input';
import { Lookup } from 'src/shared/utils/mongodb/lookupGenerator';
import { MODEL_NAMES } from 'src/database/modelNames';
import { responseFormat } from 'src/shared/graphql/queryProjection';
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

  async list(dto: ListInpuAmenity, projection: object) {
    try {
      const aggregationArray = [];
      aggregationArray.push(
        ...MatchList([
          {
            match: { status: dto.statusArray },
            required: true,
          },
          {
            match: { _id: dto?.amenityIds },
            _type_: 'objectId',
          },
        ]),
      );

      if (dto.dateFilter) {
        aggregationArray.push({
          $match: {
            createdAt: {
              $gte: dto.dateFilter.from,
              $lte: dto.dateFilter.to,
            },
          },
        });
      }

      // Sort based on any provided sorting criteria
      switch (dto.sortType) {
        case 0:
          aggregationArray.push({ $sort: { createdAt: dto.sortOrder ?? 1 } });
          break;
        case 1:
          aggregationArray.push({ $sort: { name: dto.sortOrder ?? 1 } });
          break;
        case 2:
          aggregationArray.push({ $sort: { status: dto.sortOrder ?? 1 } });
          break;
        default:
          aggregationArray.push({ $sort: { _id: dto.sortOrder ?? 1 } });
          break;
      }

      aggregationArray.push(...Paginate(dto.skip, dto.limit));
      projection && aggregationArray.push(responseFormat(projection['list']));
      if (projection['list']['createdUser']) {
        aggregationArray.push(
          ...Lookup({
            modelName: MODEL_NAMES.USER,
            responseName: 'createdUser',
            params: { userId: '$createdUserId' },
            project: responseFormat(projection['list']['createdUser']),
            conditions: {
              $_id: '$$userId',
            },
          }),
        );
      }
      console.log(JSON.stringify(aggregationArray));
      // Execute the aggregation pipeline
      const list = (await this.amenityRepository.aggregate(
        aggregationArray,
      )) as Amenity[];

      console.log({ list });
      const totalCount =
        await this.amenityRepository.totalCount(aggregationArray);

      return {
        list,
        totalCount: totalCount ?? 0,
      };
    } catch (error) {
      throw new GraphQLError(error.message ?? error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
}
