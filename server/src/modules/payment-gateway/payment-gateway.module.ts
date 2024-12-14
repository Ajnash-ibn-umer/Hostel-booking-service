import { Global, Module } from '@nestjs/common';
import { PaymentGatewayService } from './service/payment-gateway.service';
import { PaymentGatewayResolver } from './payment-gateway.resolver';

@Global()
@Module({
  providers: [PaymentGatewayService, PaymentGatewayResolver],

  exports: [PaymentGatewayService],
})
export class PaymentGatewayModule {}
