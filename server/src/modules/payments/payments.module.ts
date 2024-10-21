import { Global, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsRepository } from './repositories/payments.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelDefinitions } from 'src/database/modelDefinitions';

@Global()
@Module({
  providers: [PaymentsResolver, PaymentsService, PaymentsRepository],
  imports: [MongooseModule.forFeature([ModelDefinitions.paymentsModel])],
  exports: [PaymentsService, PaymentsRepository],
})
export class PaymentsModule {}
