import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class VerifyPaymentInput {
  @Field(() => ID)
  bookingId: string;

  @Field()
  orderId: string;
}
