import { Injectable } from '@nestjs/common';
import { CreateRoomTypeInput } from './dto/create-room-type.input';
import { UpdateRoomTypeInput } from './dto/update-room-type.input';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { RoomTypeRepository } from './reposiotries/roomType.repository';
import { generalResponse } from 'src/shared/graphql/entities/main.entity';
import { ListInputRoomType } from './dto/list-room-tyoe.input';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import { RoomType, RoomTypeListResponse } from './entities/room-type.entity';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
import {
  MatchList,
  Paginate,
  Search,
} from 'src/shared/utils/mongodb/filtration.util';
import { responseFormat } from 'src/shared/graphql/queryProjection';
@Injectable()
export class RoomTypeService {
  constructor(
    private readonly roomTypeRepository: RoomTypeRepository,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}
  async create(dto: CreateRoomTypeInput, userId: string): Promise<RoomType> {
    const time = new Date();
    try {
      const roomType: unknown = await this.roomTypeRepository.create({
        ...dto,
        status: STATUS_NAMES.ACTIVE,
        createdAt: time,
        createdUserId: userId,
      });

      if (!roomType) {
        throw 'Room type creation failed';
      }
      return roomType as RoomType;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(dto: UpdateRoomTypeInput, userId: string): Promise<RoomType> {
    const time = new Date();
    try {
      const roomType: unknown = await this.roomTypeRepository.findOneAndUpdate(
        { _id: dto._id },
        {
          ...dto,
          updatedAt: time,
          updatedUserId: userId,
        },
      );

      if (!roomType) {
        throw 'Room type update failed';
      }
      return roomType as RoomType;
    } catch (error) {
      throw new Error(error);
    }
  }

  async statusChange(
    dto: statusChangeInput,
    userId: string,
  ): Promise<generalResponse> {
    const startTime = Date.now();

    try {
      const result = await this.roomTypeRepository.updateMany(
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
        message: 'Room type status updated successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async listRoomTypes(
    dto: ListInputRoomType,
    projection: Record<string, any>,
  ): Promise<RoomTypeListResponse> {
    const pipeline: any[] = [];
    if (dto.searchingText && dto.searchingText !== '') {
      pipeline.push(Search(['name', 'description'], dto.searchingText));
    }

    pipeline.push(
      ...MatchList([
        {
          match: { status: dto.statusArray },
          _type_: 'number',
          required: true,
        },
        {
          match: { _id: dto.roomTypeIds },
          _type_: 'objectId',
          required: false,
        },
      ]),
    );

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

    const list =
      ((await this.roomTypeRepository.aggregate(pipeline as any[])) as any[]) ||
      [];

    const totalCount = await this.roomTypeRepository.totalCount(pipeline);

    console.log(list);
    return {
      list,
      totalCount: totalCount,
    };
  }
}
