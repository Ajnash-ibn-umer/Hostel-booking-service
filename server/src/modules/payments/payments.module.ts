import { Global, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsRepository } from './repositories/payments.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelDefinitions } from 'src/database/modelDefinitions';
import { UserService } from '../user/service/user.service';
import { UserRepository } from '../user/repository/user.repository';
import { ContractRepository } from 'src/repositories/contract.repository';
import { PaymentsController } from './payments.controller';
import { DamageAndSplitRepository } from '../damage_and_split/repositories/damage-and-split.repository';
import { DamageAndSplitDetailsRepository } from '../damage_and_split/repositories/damage-and-split-details.repository';

@Global()
@Module({
  providers: [
    PaymentsResolver,
    PaymentsService,
    PaymentsRepository,
    UserService,
    UserRepository,
    ContractRepository,
    DamageAndSplitRepository,
    DamageAndSplitDetailsRepository
  ],
  imports: [
    MongooseModule.forFeature([
      ModelDefinitions.paymentsModel,
      ModelDefinitions.userModel,
      ModelDefinitions.contractsModel,
      ModelDefinitions.damageAndSplitModel,
      ModelDefinitions.damageAndSplitDetailsModel,


    ]),
  ],
  exports: [PaymentsService, PaymentsRepository],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
