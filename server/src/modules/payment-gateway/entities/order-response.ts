import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderResponse {
  @Field(() => String, { nullable: true })
  order_status: string | null;

  @Field(() => String, { nullable: true })
  order_id: string | null;

  //   @Field(() => JSON, { nullable: true })
  //   order_data?: Record<string, any> | null;
}

@ObjectType()
export class paymentVerifyResponse {
  @Field(() => String, { nullable: true })
  message: string | null;

  @Field({ nullable: true })
  status: boolean;

  @Field({ nullable: true })
  transactionId: string;

  @Field({ nullable: true, defaultValue: 0 })
  payedAmount?: number = 0;

  @Field(() => Date, { nullable: true })
  transactionDate?: Date;
}
