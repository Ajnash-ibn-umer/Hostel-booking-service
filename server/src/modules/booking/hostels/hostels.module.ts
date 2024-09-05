import { Module } from '@nestjs/common';
import { HostelsService } from './services/hostels.service';
import { HostelsResolver } from './hostels.resolver';
import { ModelDefinitions } from 'src/database/modelDefinitions';
import { MongooseModule } from '@nestjs/mongoose';
import { HostelRepository } from './repositories/hostel.repository';
import { RoomRepository } from './repositories/room.repository';
import { BedRepository } from './repositories/bed.repository';
import { CounterService } from 'src/modules/counter/counter.service';
import { HostelAmenitiesLink } from 'src/database/models/join_tables/hostel_x_amenities.model';
import { HostelAmenityLinksRepository } from './repositories/hostel_amenity_link.repository';
import { HostelGalleryLinksRepository } from './repositories/hostel_gallery_link.repository';
import { RoomAmenitiesLinksRepository } from './repositories/room_amenity_link.repository';
import { RoomGalleryLinksRepository } from './repositories/room_gallery_link.repository';

@Module({
  providers: [
    HostelsResolver,
    HostelsService,
    CounterService,
    HostelRepository,
    RoomRepository,
    BedRepository,
    HostelAmenityLinksRepository,
    HostelGalleryLinksRepository,
    RoomAmenitiesLinksRepository,
    RoomGalleryLinksRepository,
  ],
  imports: [
    MongooseModule.forFeature([
      ModelDefinitions.bedModel,
      ModelDefinitions.hostelModel,
      ModelDefinitions.roomModel,
      ModelDefinitions.galleryModel,
      ModelDefinitions.galleryHostelLinksModel,
      ModelDefinitions.hostelAmenitiesLinksModel,
      ModelDefinitions.roomAmenitiesLinksModel,
      ModelDefinitions.galleryRoomLinksModel,
    ]),
  ],
})
export class HostelsModule {}
