import { Module } from '@nestjs/common';
import { RoomTypeService } from './room-type.service';
import { RoomTypeResolver } from './room-type.resolver';
import { RoomTypeRepository } from './reposiotries/roomType.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelDefinitions } from 'src/database/modelDefinitions';

@Module({
  providers: [RoomTypeResolver, RoomTypeService, RoomTypeRepository],
  imports: [MongooseModule.forFeature([ModelDefinitions.roomTypeModel])],
})
export class RoomTypeModule {}
