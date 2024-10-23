import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Payment } from 'src/database/models/payments.model';

@ObjectType()
export class PaymentsListResponse {
  @Field(() => [Payment], { description: 'List of payments' })
  list: Payment[];

  @Field(() => Number, { description: 'Total count of payments' })
  totalCount: number;
}
