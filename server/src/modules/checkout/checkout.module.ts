import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutResolver } from './checkout.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelDefinitions } from 'src/database/modelDefinitions';
import { CheckoutRequestRepository } from './repositories/checkout-request.repository';
import { UserRepository } from '../user/repository/user.repository';
import { ContractRepository } from 'src/repositories/contract.repository';
import { BedRepository } from '../booking/hostels/repositories/bed.repository';
import { MailerService } from '../mailer/mailer.service';
import { CheckoutController } from './checkout.controller';

@Module({
  providers: [
    CheckoutResolver,
    CheckoutService,
    CheckoutRequestRepository,
    UserRepository,
    ContractRepository,
    BedRepository,
    MailerService
  ],
  imports: [
    MongooseModule.forFeature([
      ModelDefinitions.checkoutRequestModel,
      ModelDefinitions.userModel,
      ModelDefinitions.contractsModel,
      ModelDefinitions.bedModel,
    ]),
  ],
  controllers: [CheckoutController],
})
export class CheckoutModule {}
