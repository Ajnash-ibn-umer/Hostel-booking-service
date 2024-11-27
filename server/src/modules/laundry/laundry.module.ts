import { Module } from '@nestjs/common';
import { LaundryService } from './laundry.service';
import { LaundryResolver } from './laundry.resolver';
import { LaundryBookingRepository } from './repositories/laundry-booking.repository';
import { ContractRepository } from 'src/repositories/contract.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelDefinitions } from 'src/database/modelDefinitions';

@Module({
  providers: [
    LaundryResolver,
    LaundryService,
    LaundryBookingRepository,
    ContractRepository,
  ],
  imports: [
    MongooseModule.forFeature([
      ModelDefinitions.laundryBookingModel,
      ModelDefinitions.contractsModel,
      ModelDefinitions.paymentsModel,
    ]),
  ],
})
export class LaundryModule {}
