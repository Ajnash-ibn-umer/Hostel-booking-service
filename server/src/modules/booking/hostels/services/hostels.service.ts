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
@Injectable()
export class HostelsService {
  constructor(
    private readonly hostelRepository: HostelRepository,
    private readonly roomRepository: RoomRepository,
    private readonly bedRepository: BedRepository,
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

              status: STATUS_NAMES.ACTIVE,
              createdAt: time,
              createdUserId: userId,
            });
          }
        }
      }
      const roomResp = await this.roomRepository.insertMany(
        instertingRooms,
        txnSession,
      );
      const bedsResp = await this.bedRepository.insertMany(
        insertingBeds,
        txnSession,
      );

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
