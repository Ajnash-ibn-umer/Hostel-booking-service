import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { BOOKING_STATUS } from 'src/database/models/booking.model';
import enumToString from 'src/shared/utils/enumTostring';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';

@InputType()
export class ListUserInput {
  @Field(() => Number, {
    nullable: true,
    description: `createdAt = 0,
      status = 1,
      name = 2,
 `,
  })
  sortType: number;

  @Field({
    nullable: true,
    description: '1: Ascending order,-1 : Descending order',
  })
  sortOrder: number;

  @Field(() => [Int], { description: enumToString(STATUS_NAMES) })
  statusFilter: number[];

  @Field(() => [ID], { nullable: true })
  userIds: string[];

  @Field(() => Int, { nullable: true })
  skip: number;

  @Field(() => Int, { nullable: false })
  limit: number;

  @Field(() => [Int], {
    nullable: true,
    description: enumToString(BOOKING_STATUS),
  })
  bookingStatusFilter: number[];

  @Field(() => String, { nullable: true })
  searchingText: string;
}
