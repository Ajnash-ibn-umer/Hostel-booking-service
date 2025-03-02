import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/guards/auth.guard';
import { generalResponse } from 'src/shared/graphql/entities/main.entity';
import { CreateOrderInput, VerifyPaymentGatewayInput } from './dto/create-order.input';
import { PaymentGatewayService } from './service/payment-gateway.service';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { OrderResponse, paymentVerifyResponse } from './entities/order-response';

@UseGuards(AuthGuard)
@Resolver()
export class PaymentGatewayResolver {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}
  @UserTypes([USER_TYPES.ADMIN, USER_TYPES.PUBLIC, USER_TYPES.USER])
  @Mutation(() => OrderResponse, { name: 'Payment_gateway_Order_Create' })
  async createOrder(@Args('orderInput') orderInput: CreateOrderInput) {
    return this.paymentGatewayService.createPaymentOrder(orderInput);
  }

  @UserTypes([USER_TYPES.ADMIN, USER_TYPES.PUBLIC, USER_TYPES.USER])
  @Mutation(() => paymentVerifyResponse, {
    name: 'Verify_Payment_Gateway_Order',
  })
  async verifyPaymentGatewayOrder(
    @Args('VerifyPaymentGatewayInput') verifyPaymentGatewayInput: VerifyPaymentGatewayInput,
  ) {
    return this.paymentGatewayService.verifyPaymentGatewayOrder(verifyPaymentGatewayInput);
  }
}
