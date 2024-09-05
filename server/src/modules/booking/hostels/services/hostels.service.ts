import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateHostelInput } from '../dto/create-hostel.input';
import { UpdateHostelInput } from '../dto/update-hostel.input';
import { GraphQLError } from 'graphql';
import { HostelRepository } from '../repositories/hostel.repository';
import { RoomRepository } from '../repositories/room.repository';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
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
@Injectable()
export class HostelsService {
  constructor(
    private readonly hostelRepository: HostelRepository,
    private readonly roomRepository: RoomRepository,
    private readonly bedRepository: BedRepository,
    private readonly hostelAmenityLinkRepo: HostelAmenityLinksRepository,
    private readonly hostelgalleryLinkRepo: HostelGalleryLinksRepository,

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

          for (let bed of room.beds) {
            insertingBeds.push({
              availabilityStatus: bed.availabilityStatus,
              bedPosition: bed.bedPosition,
              floor: bed.floor,
              name: bed.name,
              paymentBase: bed.paymentBase,
              roomId: roomId.toString(),
              roomTypeId: bed.roomTypeId,
              propertyId: newhostel._id,

              status: STATUS_NAMES.ACTIVE,
              createdAt: time,
              createdUserId: userId,
            });
          }
        }
      }

      if (dto.aminities && dto.aminities.length > 0) {
        const amenitiesLinks: any = dto.aminities.map((id) => ({
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
        await this.hostelgalleryLinkRepo.insertMany(galleriesLinks, txnSession);
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
}
