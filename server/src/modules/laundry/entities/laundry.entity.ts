import { ObjectType, Field, Int } from '@nestjs/graphql';
import { LaundryBooking } from 'src/database/models/laundry.model';

@ObjectType()
export class LaundryListResponse {
  @Field(() => [LaundryBooking], { nullable: true })
  list: LaundryBooking[];

  @Field(() => Number, { nullable: true })
  totalCount: number;
}
