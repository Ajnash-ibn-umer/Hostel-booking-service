import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateHostelInput } from '../dto/create-hostel.input';
import { UpdateHostelInput } from '../dto/update-hostel.input';
import { GraphQLError } from 'graphql';
import { HostelRepository } from '../repositories/hostel.repository';
import { RoomRepository } from '../repositories/room.repository';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { PipelineStage } from 'mongoose';
import { Room } from 'src/database/models/room.model';
import { Bed } from 'src/database/models/bed.model';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import { CounterService } from 'src/modules/counter/counter.service';
import { MODEL_NAMES } from 'src/database/modelNames';
import { generateSlug } from 'src/shared/utils/slug_gen';
import { BedRepository } from '../repositories/bed.repository';
import { HostelAmenityLinksRepository } from '../repositories/hostel_amenity_link.repository';
import { HostelAmenitiesLinkDocument } from 'src/database/models/join_tables/hostel_x_amenities.model';
import { HostelGalleryLinksRepository } from '../repositories/hostel_gallery_link.repository';
import { RoomAmenitiesLinksRepository } from '../repositories/room_amenity_link.repository';
import { RoomGalleryLinksRepository } from '../repositories/room_gallery_link.repository';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
import { ListInputHostel } from '../dto/list-hostel.input';
import { ListHostelsResponse } from '../entities/hostel.entity';
import {
  MatchList,
  Paginate,
  Search,
} from 'src/shared/utils/mongodb/filtration.util';
import { Lookup } from 'src/shared/utils/mongodb/lookupGenerator';
import { responseFormat } from 'src/shared/graphql/queryProjection';

@Injectable()
export class HostelsService {
  constructor(
    private readonly hostelRepository: HostelRepository,
    private readonly roomRepository: RoomRepository,
    private readonly bedRepository: BedRepository,
    private readonly hostelAmenityLinkRepo: HostelAmenityLinksRepository,
    private readonly hostelGalleryLinkRepo: HostelGalleryLinksRepository,
    private readonly roomAmenityLinkRepo: RoomAmenitiesLinksRepository,
    private readonly roomGalleryLinkRepo: RoomGalleryLinksRepository,

    private readonly counterService: CounterService,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}
  async create(dto: CreateHostelInput, userId: string) {
    const txnSession = await this.connection.startSession();
    const time = new Date();
    await txnSession.startTransaction();
    try {
      const instertingRooms: any[] = [];
      const insertingBeds: any[] = [];

      const hostelSlug = generateSlug(dto.name);
      const newCountData = await this.counterService.getAndIncrementCounter({
        entityName: MODEL_NAMES.HOSTEL,
      });

      if (!newCountData) {
        throw 'Hostel count not found';
      }
      const newhostel = await this.hostelRepository.create(
        {
          ...dto,
          slug: hostelSlug,
          propertyNo: `${newCountData.prefix}${newCountData.count}${newCountData.suffix}`,
          status: STATUS_NAMES.ACTIVE,
          createdAt: time,
          createdUserId: userId,
        },
        txnSession,
      );
      console.log({ newhostel });
      if (dto.rooms && dto.rooms.length > 0) {
        for (let room of dto.rooms) {
          const roomId = new mongoose.Types.ObjectId();
          const roomSLug = generateSlug(room.name);
          instertingRooms.push({
            _id: roomId,
            name: room.name,
            slug: roomSLug,
            propertyId: newhostel._id.toString(),
            createdAt: time,
            createdUserId: userId,
            floor: room.floor,
            roomTypeId: room.roomTypeId,
            totalBeds: room.totalBeds,
            status: STATUS_NAMES.ACTIVE,
          });

          if (room.beds && room.beds.length > 0) {
            let idx = 1;
            for (let bed of room.beds) {
              const bedName = `${room.name}-${idx}`;
              insertingBeds.push({
                availabilityStatus: bed.availabilityStatus,
                bedPosition: bed.bedPosition,
                floor: bed.floor,
                name: bedName,
                paymentBase: bed.paymentBase,
                roomId: roomId.toString(),
                roomTypeId: bed.roomTypeId,
                propertyId: newhostel._id,

                status: STATUS_NAMES.ACTIVE,
                createdAt: time,
                createdUserId: userId,
              });

              idx++;
            }
          }

          // Create galleryRoom link
          if (room.galleryIds && room.galleryIds.length > 0) {
            const galleryRoomLinks: any[] = room.galleryIds.map(
              (galleryId) => ({
                roomId: roomId.toString(),
                galleryId: galleryId,
                status: STATUS_NAMES.ACTIVE,
                createdAt: time,
                createdUserId: userId,
              }),
            );
            await this.roomGalleryLinkRepo.insertMany(
              galleryRoomLinks,
              txnSession,
            );
          }

          // Create amenityRoom link
          if (room.aminityIds && room.aminityIds.length > 0) {
            const amenityRoomLinks: any[] = room.aminityIds.map(
              (amenityId) => ({
                roomId: roomId.toString(),
                amenityId: amenityId,
                status: STATUS_NAMES.ACTIVE,
                createdAt: time,
                createdUserId: userId,
              }),
            );
            await this.roomAmenityLinkRepo.insertMany(
              amenityRoomLinks,
              txnSession,
            );
          }
        }
      }

      if (dto.aminityIds && dto.aminityIds.length > 0) {
        const amenitiesLinks: any = dto.aminityIds.map((id) => ({
          hostelId: newhostel._id,
          amenityId: id,
          status: STATUS_NAMES.ACTIVE,
          createdAt: time,
          createdUserId: userId,
        }));
        await this.hostelAmenityLinkRepo.insertMany(amenitiesLinks, txnSession);
      }
      if (dto.galleryIds && dto.galleryIds.length > 0) {
        const galleriesLinks: any = dto.galleryIds.map((id) => ({
          hostelId: newhostel._id,
          galleryId: id,
          status: STATUS_NAMES.ACTIVE,
          createdAt: time,
          createdUserId: userId,
        }));
        await this.hostelGalleryLinkRepo.insertMany(galleriesLinks, txnSession);
      }
      const roomResp = await this.roomRepository.insertMany(
        instertingRooms,
        txnSession,
      );
      const bedsResp = await this.bedRepository.insertMany(
        insertingBeds,
        txnSession,
      );
      console.log({ bedsResp });
      roomResp['beds'] = bedsResp;
      newhostel['rooms'] = roomResp;

      await txnSession.commitTransaction();
      return newhostel;
    } catch (error) {
      await txnSession.abortTransaction();
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    } finally {
      await txnSession.endSession();
    }
  }

  async update(dto: UpdateHostelInput, userId: string) {
    const txnSession = await this.connection.startSession();
    const time = new Date();
    await txnSession.startTransaction();
    try {
      const instertingRooms: any[] = [];
      const insertingBeds: any[] = [];

      const hostelSlug = generateSlug(dto.name);

      const newhostel = await this.hostelRepository.create(
        {
          ...dto,
          slug: hostelSlug,
          updatedAt: time,
          updatedUserId: userId,
        },
        txnSession,
      );
      console.log({ newhostel });
      if (dto.rooms && dto.rooms.length > 0) {
        for (let room of dto.rooms) {
          const roomSLug = generateSlug(room.name);

          let roomId = new mongoose.Types.ObjectId();

          if (room._id && room._id !== '') {
            roomId = new mongoose.Types.ObjectId(room._id);
            instertingRooms.push({
              updateOne: {
                filter: {
                  _id: roomId,
                },
                update: {
                  name: room.name,
                  slug: roomSLug,
                  updatedAt: time,
                  updatedUserId: userId,
                  floor: room.floor,
                  roomTypeId: room.roomTypeId,
                  totalBeds: room.totalBeds,
                },
              },
            });
          } else {
            instertingRooms.push({
              insertOne: {
                document: {
                  _id: roomId,
                  name: room.name,
                  slug: roomSLug,
                  propertyId: newhostel._id.toString(),
                  createdAt: time,
                  createdUserId: userId,
                  floor: room.floor,
                  roomTypeId: room.roomTypeId,
                  totalBeds: room.totalBeds,
                  status: STATUS_NAMES.ACTIVE,
                },
              },
            });
          }

          if (room.beds && room.beds.length > 0) {
            let idx = 1;
            for (let bed of room.beds) {
              let bedId = new mongoose.Types.ObjectId();

              if (bed._id && bed._id !== '') {
                bedId = new mongoose.Types.ObjectId(bed._id);
                insertingBeds.push({
                  updateOne: {
                    filter: {
                      _id: bedId,
                    },
                    update: {
                      availabilityStatus: bed.availabilityStatus,
                      bedPosition: bed.bedPosition,
                      floor: bed.floor,
                      name: bed.name,
                      paymentBase: bed.paymentBase,
                      roomId: roomId.toString(),
                      roomTypeId: bed.roomTypeId,
                      updatedAt: time,
                      updatedUserId: userId,
                    },
                  },
                });
              } else {
                const bedName = `${room.name}-${idx}`;

                insertingBeds.push({
                  insertOne: {
                    document: {
                      _id: bedId,
                      availabilityStatus: bed.availabilityStatus,
                      bedPosition: bed.bedPosition,
                      floor: bed.floor,
                      name: bedName,
                      paymentBase: bed.paymentBase,
                      roomId: roomId.toString(),
                      roomTypeId: bed.roomTypeId,
                      propertyId: newhostel._id.toString(),
                      status: STATUS_NAMES.ACTIVE,
                      createdAt: time,
                      createdUserId: userId,
                    },
                  },
                });

                idx++;
              }
            }
          }

          // Create galleryRoom link
          if (room.galleryIds && room.galleryIds.length > 0) {
            await this.roomGalleryLinkRepo.deleteMany({
              roomId: roomId.toString(),
              status: STATUS_NAMES.ACTIVE,
            });
            const galleryRoomLinks: any[] = room.galleryIds.map(
              (galleryId) => ({
                roomId: roomId.toString(),
                galleryId: galleryId,
                status: STATUS_NAMES.ACTIVE,
                createdAt: time,
                createdUserId: userId,
              }),
            );
            await this.roomGalleryLinkRepo.insertMany(
              galleryRoomLinks,
              txnSession,
            );
          }

          // Create amenityRoom link
          if (room.aminityIds && room.aminityIds.length > 0) {
            await this.roomAmenityLinkRepo.deleteMany({
              roomId: roomId.toString(),
              status: STATUS_NAMES.ACTIVE,
            });
            const amenityRoomLinks: any[] = room.aminityIds.map(
              (amenityId) => ({
                roomId: roomId.toString(),
                amenityId: amenityId,
                status: STATUS_NAMES.ACTIVE,
                createdAt: time,
                createdUserId: userId,
              }),
            );
            await this.roomAmenityLinkRepo.insertMany(
              amenityRoomLinks,
              txnSession,
            );
          }
        }
      }

      if (dto.aminityIds && dto.aminityIds.length > 0) {
        await this.hostelAmenityLinkRepo.deleteMany({
          roomId: dto._id.toString(),
          status: STATUS_NAMES.ACTIVE,
        });
        const amenitiesLinks: any = dto.aminityIds.map((id) => ({
          hostelId: newhostel._id,
          amenityId: id,
          status: STATUS_NAMES.ACTIVE,
          createdAt: time,
          createdUserId: userId,
        }));
        await this.hostelAmenityLinkRepo.insertMany(amenitiesLinks, txnSession);
      }
      if (dto.galleryIds && dto.galleryIds.length > 0) {
        await this.hostelGalleryLinkRepo.deleteMany({
          roomId: dto._id.toString(),
          status: STATUS_NAMES.ACTIVE,
        });
        const galleriesLinks: any = dto.galleryIds.map((id) => ({
          hostelId: newhostel._id,
          galleryId: id,
          status: STATUS_NAMES.ACTIVE,
          createdAt: time,
          createdUserId: userId,
        }));
        await this.hostelGalleryLinkRepo.insertMany(galleriesLinks, txnSession);
      }

      await this.roomRepository.deleteMany(
        dto.deletedRoomIds || [],
        txnSession,
      );
      await this.bedRepository.deleteMany(dto.deletedRoomIds || [], txnSession);

      const roomResp = await this.roomRepository.bulkWriteMany(
        instertingRooms,
        txnSession,
      );
      const bedsResp = await this.bedRepository.bulkWriteMany(
        insertingBeds,
        txnSession,
      );
      console.log({ bedsResp });
      roomResp['beds'] = bedsResp;
      newhostel['rooms'] = roomResp;

      await txnSession.commitTransaction();

      return;
    } catch (error) {
      await txnSession.abortTransaction();
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    } finally {
      await txnSession.endSession();
    }
  }

  async statusChange(dto: statusChangeInput, userId: string) {
    const startTime = Date.now();

    try {
      var result = await this.hostelRepository.updateMany(
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
      var resultRooms = await this.roomRepository.updateMany(
        {
          propertyId: { $in: dto.ids },
        },
        {
          $set: {
            updatedUserId: userId,
            updatedAt: startTime,
            status: dto._status,
          },
        },
      );

      var resultBeds = await this.bedRepository.updateMany(
        {
          propertyId: { $in: dto.ids },
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
        message: 'Hostel status updated successfully',
      };
    } catch (error) {
      return new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async listHostels(
    dto: ListInputHostel,
    projection: Record<string, any>,
  ): Promise<ListHostelsResponse | GraphQLError> {
    try {
      const pipeline: any[] = [];
      if (dto.searchingText && dto.searchingText !== '') {
        pipeline.push(Search(['propertyNo', 'name'], dto.searchingText));
      }

      pipeline.push(
        ...MatchList([
          {
            match: { status: dto.statusArray },
            _type_: 'number',
            required: true,
          },
          {
            match: { _id: dto.hostelIds },
            _type_: 'objectId',
            required: false,
          },
          {
            match: { categoryId: dto.categoryIds },
            _type_: 'objectId',
            required: false,
          },
          {
            match: { locationId: dto.locationIds },
            _type_: 'objectId',
            required: false,
          },
          {
            match: { propertyNo: dto.propertyNumberFilter },
            _type_: 'string',
            required: false,
          },
          {
            match: { availabilityStatus: dto.availblityStatusFilter },
            _type_: 'number',
            required: false,
          },
          {
            match: { priceBaseMode: dto.priceBaseModeFilter },
            _type_: 'number',
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
      if (projection['list']['amenities']) {
        pipeline.push(
          ...Lookup({
            modelName: MODEL_NAMES.HOSTEL_X_AMENITIES,
            params: { id: '$_id' },
            conditions: { $hostelId: '$$id' },
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
            modelName: MODEL_NAMES.GALLERY_HOSTEL_LINKS,
            params: { id: '$_id' },
            conditions: { $hostelId: '$$id' },
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

      if (projection['list']['rooms']) {
        const roomPipeLine = [];
        if (projection['list']['rooms']['amenities']) {
          roomPipeLine.push(
            ...Lookup({
              modelName: MODEL_NAMES.HOSTEL_X_AMENITIES,
              params: { id: '$_id' },
              conditions: { $roomId: '$$id' },
              responseName: 'amenities',
              isNeedUnwind: false,
              innerPipeline: [
                ...Lookup({
                  modelName: MODEL_NAMES.AMENITIES,
                  params: { id: '$amenityId' },
                  project: responseFormat(
                    projection['list']['rooms']['amenities'],
                  ),
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
        if (projection['list']['rooms']['galleries']) {
          roomPipeLine.push(
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
                  project: responseFormat(
                    projection['list']['rooms']['galleries'],
                  ),
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
        if (projection['list']['rooms']['beds']) {
          roomPipeLine.push(
            ...Lookup({
              modelName: MODEL_NAMES.BED,
              params: { id: '$_id' },
              project: responseFormat(projection['list']['rooms']['beds']),
              conditions: { $roomId: '$$id' },
              isNeedUnwind: false,
              responseName: 'beds',
            }),
          );
        }
        pipeline.push(
          ...Lookup({
            modelName: MODEL_NAMES.ROOM,
            params: { id: '$_id' },
            conditions: { $propertyId: '$$id' },
            project: responseFormat(projection['list']['rooms']),
            responseName: 'rooms',
            isNeedUnwind: false,
            innerPipeline: roomPipeLine,
          }),
        );
      }
      if (projection['list']['category']) {
        console.log('in category');
        pipeline.push(
          ...Lookup({
            modelName: MODEL_NAMES.CATEGORY,
            params: { id: '$categoryId' },
            project: responseFormat(projection['list']['category']),
            conditions: { $_id: '$$id' },
            responseName: 'category',
          }),
        );
      }
      if (projection['list']['location']) {
        pipeline.push(
          ...Lookup({
            modelName: MODEL_NAMES.LOCATION,
            params: { id: '$locationId' },
            project: responseFormat(projection['list']['location']),
            conditions: { $_id: '$$id' },
            responseName: 'location',
          }),
        );
      }
      const list =
        ((await this.hostelRepository.aggregate(
          pipeline as PipelineStage[],
        )) as any[]) || [];

      const totalCount = await this.hostelRepository.totalCount(pipeline);

      console.log(list);
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
