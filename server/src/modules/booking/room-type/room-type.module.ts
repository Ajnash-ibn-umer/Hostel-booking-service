import { Module } from '@nestjs/common';
import { RoomTypeService } from './room-type.service';
import { RoomTypeResolver } from './room-type.resolver';

@Module({
  providers: [RoomTypeResolver, RoomTypeService],
})
export class RoomTypeModule {}
