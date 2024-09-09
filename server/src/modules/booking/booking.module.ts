import { Module } from '@nestjs/common';
import { HostelsModule } from './hostels/hostels.module';
import { PropertyCategoryModule } from './property-category/property-category.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { RoomTypeModule } from './room-type/room-type.module';

@Module({
  imports: [
    HostelsModule,
    PropertyCategoryModule,
    AmenitiesModule,
    RoomTypeModule,
  ],
})
export class BookingModule {}
