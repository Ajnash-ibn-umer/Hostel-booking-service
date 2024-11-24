import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CheckoutRequest } from 'src/database/models/checkout-request.model';

@ObjectType()
export class CheckoutRequestListResponse {
  @Field(() => [CheckoutRequest], { nullable: true })
  list: CheckoutRequest[];

  @Field(() => Number, { nullable: true })
  totalCount: number;
}
