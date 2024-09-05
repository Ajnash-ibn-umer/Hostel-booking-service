import { Module } from '@nestjs/common';
import { HostelsModule } from './hostels/hostels.module';

@Module({
  imports: [HostelsModule],
})
export class BookingModule {}
