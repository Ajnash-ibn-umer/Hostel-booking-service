import { Module } from '@nestjs/common';
import { DamageAndSplitService } from './damage_and_split.service';
import { DamageAndSplitResolver } from './damage_and_split.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { MODEL_NAMES } from 'src/database/modelNames';
import { ModelDefinitions } from 'src/database/modelDefinitions';
import { DamageAndSplitRepository } from './repositories/damage-and-split.repository';
import { DamageAndSplitDetailsRepository } from './repositories/damage-and-split-details.repository';

@Module({
  providers: [
    DamageAndSplitResolver,
    DamageAndSplitService,
    DamageAndSplitRepository,
    DamageAndSplitDetailsRepository,
  ],
  imports: [
    MongooseModule.forFeature([
      ModelDefinitions.damageAndSplitDetailsModel,
      ModelDefinitions.damageAndSplitModel,
      ModelDefinitions.paymentsModel,
    ]),
  ],
})
export class DamageAndSplitModule {}
