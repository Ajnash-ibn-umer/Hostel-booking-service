import { Module } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { AmenitiesResolver } from './amenities.resolver';
import { AmenityRepository } from './repositories/amenity.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MODEL_NAMES } from 'src/database/modelNames';
import { AmenitySchema } from 'src/database/models/amenity.model';

@Module({
  providers: [AmenitiesResolver, AmenitiesService, AmenityRepository],

  imports: [
    MongooseModule.forFeature([
      { name: MODEL_NAMES.AMENITIES, schema: AmenitySchema },
    ]),
  ],
})
export class AmenitiesModule {}
