import { Global, Module } from '@nestjs/common';
import { HostelsModule } from './hostels/hostels.module';
import { PropertyCategoryModule } from './property-category/property-category.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { RoomTypeModule } from './room-type/room-type.module';
import { BookingService } from './services/booking.service';
import { HostelsResolver } from './hostels/hostels.resolver';
import { HostelsService } from './hostels/services/hostels.service';
import { CounterService } from '../counter/counter.service';
import { HostelRepository } from './hostels/repositories/hostel.repository';
import { RoomRepository } from './hostels/repositories/room.repository';
import { BedRepository } from './hostels/repositories/bed.repository';
import { HostelAmenityLinksRepository } from './hostels/repositories/hostel_amenity_link.repository';
import { HostelGalleryLinksRepository } from './hostels/repositories/hostel_gallery_link.repository';
import { RoomAmenitiesLinksRepository } from './hostels/repositories/room_amenity_link.repository';
import { RoomGalleryLinksRepository } from './hostels/repositories/room_gallery_link.repository';
import { RoomsService } from './hostels/services/rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelDefinitions } from 'src/database/modelDefinitions';
import { BookingResolver } from './booking.resolver';
import { BookingRepository } from './repositories/booking.repository';
import { BookingStatusHistoryRepository } from './repositories/booking-status.repository';
import { InvoiceRepository } from 'src/repositories/invoice.repository';
import { InvoiceItemRepository } from 'src/repositories/invoice-item.repository';
import { ContractRepository } from 'src/repositories/contract.repository';
import { TranasactionRepository } from 'src/repositories/transaction.repository';

@Module({
  imports: [
    HostelsModule,
    PropertyCategoryModule,
    AmenitiesModule,
    RoomTypeModule,
    MongooseModule.forFeature([
      ModelDefinitions.bedModel,
      ModelDefinitions.hostelModel,
      ModelDefinitions.roomModel,
      ModelDefinitions.galleryModel,
      ModelDefinitions.galleryHostelLinksModel,
      ModelDefinitions.hostelAmenitiesLinksModel,
      ModelDefinitions.roomAmenitiesLinksModel,
      ModelDefinitions.galleryRoomLinksModel,
      ModelDefinitions.bookingModel,
      ModelDefinitions.bookingStatusHistoryModel,
      ModelDefinitions.invoiceItemsModel,
      ModelDefinitions.invoicesModel,
      ModelDefinitions.contractsModel,
      ModelDefinitions.transactionsModel,
    ]),
  ],
  providers: [
    BookingService,
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
    BookingStatusHistoryRepository,
    BookingRepository,
    RoomsService,
    BookingResolver,
    InvoiceRepository,
    InvoiceItemRepository,
    ContractRepository,
    TranasactionRepository,
  ],
})
export class BookingModule {}
