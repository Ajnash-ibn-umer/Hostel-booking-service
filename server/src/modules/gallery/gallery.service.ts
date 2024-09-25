import { Injectable } from '@nestjs/common';
import {
  CreateGalleryInput,
  CreateGalleryMultipleInput,
} from './dto/create-gallery.input';
import { UpdateGalleryInput } from './dto/update-gallery.input';
import { GalleryRepository } from './repository/gallery.respository';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import { CounterService } from '../counter/counter.service';
import { MODEL_NAMES } from 'src/database/modelNames';
import {
  MatchList,
  Paginate,
  Search,
} from 'src/shared/utils/mongodb/filtration.util';
import { responseFormat } from 'src/shared/graphql/queryProjection';
import { ListInputGallery } from './dto/list-gallery.input';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
@Injectable()
export class GalleryService {
  constructor(
    private readonly galleryRepository: GalleryRepository,
    @InjectConnection() private readonly connection: Connection,
    private readonly counterService: CounterService,
  ) {}
  async create(dto: CreateGalleryInput, userId: string) {
    const txnSession = await this.connection.startSession();
    const time = new Date();
    await txnSession.startTransaction();
    try {
      const newCountData = await this.counterService.getAndIncrementCounter({
        entityName: MODEL_NAMES.GALLERY,
      });
      const newGallery = await this.galleryRepository.create(
        {
          ...dto,
          uid: `${newCountData.prefix}${newCountData.count}`,
          status: STATUS_NAMES.ACTIVE,
          createdAt: time,
          createdUserId: userId,
        },
        txnSession,
      );
      await txnSession.commitTransaction();
      return newGallery;
    } catch (error) {
      await txnSession.abortTransaction();
      throw new Error(error);
    } finally {
      await txnSession.endSession();
    }
  }
  async createMulti(dto: CreateGalleryMultipleInput, userId: string) {
    const txnSession = await this.connection.startSession();
    const time = new Date();
    await txnSession.startTransaction();
    try {
      const counterData = await this.counterService.getCounterByEntityName({
        entityName: MODEL_NAMES.GALLERY,
      });

      const insertionData = dto.galleryData.map((gallery) => {
        counterData.count += 1;
        return {
          ...gallery,
          uid: `${counterData.prefix}${counterData.count}`,
          status: STATUS_NAMES.ACTIVE,
          createdAt: time,
          createdUserId: userId,
        };
      });

      const finalCount = counterData.count;
      const newCountData = await this.counterService.getAndIncrementCounter(
        {
          entityName: MODEL_NAMES.GALLERY,
        },
        finalCount,
        txnSession,
      );
      const newGallery = await this.galleryRepository.insertMany(
        insertionData as any,
        txnSession,
      );
      await txnSession.commitTransaction();
      return newGallery;
    } catch (error) {
      await txnSession.abortTransaction();
      throw new Error(error);
    } finally {
      await txnSession.endSession();
    }
  }
  async update(dto: UpdateGalleryInput, userId: string) {
    const txnSession = await this.connection.startSession();
    const time = new Date();
    await txnSession.startTransaction();
    try {
      const updatedGallery = await this.galleryRepository.findOneAndUpdate(
        { _id: dto._id },
        {
          ...dto,
          updatedAt: time,
          updatedUserId: userId,
        },
        txnSession,
      );
      await txnSession.commitTransaction();
      return updatedGallery;
    } catch (error) {
      await txnSession.abortTransaction();
      throw new Error(error);
    } finally {
      await txnSession.endSession();
    }
  }

  async statusChange(dto: statusChangeInput, userId: string) {
    const startTime = Date.now();
    try {
      const result = await this.galleryRepository.updateMany(
        { _id: { $in: dto.ids } },
        {
          $set: {
            updatedUserId: userId,
            updatedAt: startTime,
            status: dto._status,
          },
        },
      );
      return {
        message: 'Gallery status updated successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async list(dto: ListInputGallery, projection: Record<string, any>) {
    const pipeline: any[] = [];
    if (dto.searchingText && dto.searchingText !== '') {
      pipeline.push(Search(['url', 'name'], dto.searchingText));
    }

    pipeline.push(
      ...MatchList([
        {
          match: { status: dto.statusArray },
          _type_: 'number',
          required: true,
        },
        {
          match: { _id: dto.galleryIds },
          _type_: 'string',
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
      (await this.galleryRepository.aggregate(pipeline as any[])) || [];

    const totalCount = await this.galleryRepository.totalCount(pipeline);
    return {
      list,
      totalCount: totalCount,
    };
  }
}
