import { Field, ID, InputType, Int, PartialType } from '@nestjs/graphql';
import { BOOKING_STATUS } from 'src/database/models/booking.model';

import {
  GenericListInput,
  RangeInput,
} from 'src/shared/graphql/entities/main.dto';
import enumToString from 'src/shared/utils/enumTostring';

@InputType()
export class ListInputBooking extends PartialType(GenericListInput) {
  @Field(() => [ID], { nullable: true })
  roomIds: string[];

  @Field(() => [ID], { nullable: true })
  bedIds: string[];

  @Field(() => [ID], { nullable: true })
  propertyIds: string[];

  @Field(() => [ID], { nullable: true })
  invoiceIds: string[];

  @Field(() => [ID], { nullable: true })
  bookingIds: string[];

  @Field(() => [Int], {
    nullable: true,
    description: enumToString(BOOKING_STATUS),
  })
  bookingStatus: number[];
}
