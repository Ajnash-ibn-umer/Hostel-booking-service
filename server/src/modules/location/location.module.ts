import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationResolver } from './location.resolver';
import { LocationRepository } from './repositories/location.repository';
import { ModelDefinitions } from 'src/database/modelDefinitions';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [LocationResolver, LocationService, LocationRepository],
  imports: [MongooseModule.forFeature([ModelDefinitions.locationModel])],
})
export class LocationModule {}
