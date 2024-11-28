import { ObjectType, Field, Int } from '@nestjs/graphql';
import { LaundryBooking } from 'src/database/models/laundry.model';

@ObjectType()
export class LaundryListResponse {
  @Field(() => [LaundryBooking], { nullable: true })
  list: LaundryBooking[];

  @Field(() => Number, { nullable: true })
  totalCount: number;
}

@ObjectType()
export class LaundryLimit {
  @Field(() => Number, { nullable: true })
  laundryTotalMonthlyLimit: number;

  @Field(() => Number, { nullable: true })
  laundryMonthlyUsedCount: number;
}
