import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { PipelineStage } from 'mongoose';
import { RoomRepository } from '../repositories/room.repository';
import { ListInputRoom } from '../dto/list-room.input';
import {
  MatchList,
  Paginate,
  Search,
} from 'src/shared/utils/mongodb/filtration.util';
import { Lookup } from 'src/shared/utils/mongodb/lookupGenerator';
import { MODEL_NAMES } from 'src/database/modelNames';
import { responseFormat } from 'src/shared/graphql/queryProjection';
import { GraphQLError } from 'graphql';
@Injectable()
export class RoomsService {
  constructor(
    private readonly roomRepository: RoomRepository,

    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}

  async listRoom(dto: ListInputRoom, projection: Record<string, any>) {
    try {
      const pipeline: any[] = [];
      if (dto.searchingText && dto.searchingText !== '') {
        pipeline.push(
          Search(
            ['slug', 'name', 'floor', 'description', 'totalBeds'],
            dto.searchingText,
          ),
        );
      }

      pipeline.push(
        ...MatchList([
          {
            match: { status: dto.statusArray },
            _type_: 'number',
            required: true,
          },
          {
            match: { propertyId: dto.hostelIds },
            _type_: 'objectId',
            required: false,
          },
          {
            match: { roomTypeId: dto.roomTypeIds },
            _type_: 'objectId',
            required: false,
          },
          {
            match: { _id: dto.roomIds },
            _type_: 'objectId',
            required: false,
          },
        ]),
      );

      if (dto.amenityIds && dto.amenityIds.length > 0) {
        const aIds = dto.amenityIds.map(
          (id) => new mongoose.Types.ObjectId(id),
        );
        pipeline.push(
          ...Lookup({
            modelName: MODEL_NAMES.HOSTEL_X_AMENITIES,
            params: { id: '$_id' },
            conditions: { $hostelId: '$$id' },
            responseName: 'amenityLink',
            isNeedUnwind: false,
            conditionWithArray: {
              $amenityId: aIds,
            },
          }),

          {
            $match: {
              amenityLink: { $ne: [] },
            },
          },
        );
      }
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

      if (projection['list']['amenities']) {
        pipeline.push(
          ...Lookup({
            modelName: MODEL_NAMES.ROOM_X_AMENITIES,
            params: { id: '$_id' },
            conditions: { $roomId: '$$id' },
            responseName: 'amenities',
            isNeedUnwind: false,
            innerPipeline: [
              ...Lookup({
                modelName: MODEL_NAMES.AMENITIES,
                params: { id: '$amenityId' },
                project: responseFormat(projection['list']['amenities']),
                conditions: { $_id: '$$id' },
                responseName: 'amenitiesData',
              }),
            ],
          }),
          {
            $addFields: {
              amenities: '$amenities.amenitiesData',
            },
          },
        );
      }

      if (projection['list']['galleries']) {
        pipeline.push(
          ...Lookup({
            modelName: MODEL_NAMES.GALLERY_ROOM_LINKS,
            params: { id: '$_id' },
            conditions: { $roomId: '$$id' },
            responseName: 'galleries',
            isNeedUnwind: false,
            innerPipeline: [
              ...Lookup({
                modelName: MODEL_NAMES.GALLERY,
                params: { id: '$galleryId' },
                project: responseFormat(projection['list']['galleries']),
                conditions: { $_id: '$$id' },
                responseName: 'galleries',
              }),
            ],
          }),
          {
            $addFields: {
              galleries: '$galleries.galleries',
            },
          },
        );
      }

      if (projection['list']['beds']) {
        pipeline.push(
          ...Lookup({
            modelName: MODEL_NAMES.BED,
            params: { id: '$_id' },
            project: responseFormat(projection['list']['beds']),
            conditions: { $roomId: '$$id' },
            isNeedUnwind: false,
            responseName: 'beds',
          }),
        );
      }

      if (projection['list']['roomType']) {
        pipeline.push(
          ...Lookup({
            modelName: MODEL_NAMES.ROOM_TYPES,
            params: { id: '$roomTypeId' },
            project: responseFormat(projection['list']['roomType']),
            conditions: { $_id: '$$id' },
            responseName: 'roomType',
          }),
        );
      }
      if (projection['list']['property']) {
        pipeline.push(
          ...Lookup({
            modelName: MODEL_NAMES.HOSTEL,
            params: { id: '$propertyId' },
            project: responseFormat(projection['list']['property']),
            conditions: { $_id: '$$id' },
            responseName: 'property',
          }),
        );
      }
      const list =
        ((await this.roomRepository.aggregate(
          pipeline as PipelineStage[],
        )) as any[]) || [];

      const totalCount = await this.roomRepository.totalCount(pipeline);

      return {
        list,
        totalCount: totalCount,
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
