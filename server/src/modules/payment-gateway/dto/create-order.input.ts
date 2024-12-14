import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field(() => Number)
  amount: number;

  @Field(() => String, { nullable: true })
  remark: string;
}

@InputType()
export class VerifyPaymentGatewayInput {
  @Field(() => String, { nullable: true })
  order_uuid: string;

  @Field(() => String, { nullable: false })
  razorPay_orderId: string;

  @Field(() => String, { nullable: false })
  razorPay_signature: string;

  @Field(() => String, { nullable: true })
  razorPay_paymentId: string;
}

