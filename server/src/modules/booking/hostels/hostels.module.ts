import { Module } from '@nestjs/common';
import { HostelsService } from './hostels.service';
import { HostelsResolver } from './hostels.resolver';

@Module({
  providers: [HostelsResolver, HostelsService],
})
export class HostelsModule {}
