import { Field, ID, InputType } from '@nestjs/graphql';
import { VerifyPaymentGatewayInput } from 'src/modules/payment-gateway/dto/create-order.input';

@InputType()
export class VerifyPaymentInput extends VerifyPaymentGatewayInput {
  @Field(() => ID)
  bookingId: string;

  @Field()
  amount: number;
}
