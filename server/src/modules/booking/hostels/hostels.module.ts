import { Module } from '@nestjs/common';
import { HostelsService } from './services/hostels.service';
import { HostelsResolver } from './hostels.resolver';
import { ModelDefinitions } from 'src/database/modelDefinitions';
import { MongooseModule } from '@nestjs/mongoose';
import { HostelRepository } from './repositories/hostel.repository';
import { RoomRepository } from './repositories/room.repository';
import { BedRepository } from './repositories/bed.repository';
import { CounterService } from 'src/modules/counter/counter.service';

@Module({
  providers: [
    HostelsResolver,
    HostelsService,
    CounterService,
    HostelRepository,
    RoomRepository,
    BedRepository,
  ],
  imports: [
    MongooseModule.forFeature([
      ModelDefinitions.bedModel,
      ModelDefinitions.hostelModel,
      ModelDefinitions.roomModel,
    ]),
  ],
})
export class HostelsModule {}
