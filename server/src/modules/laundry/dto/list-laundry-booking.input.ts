import { Field, ID, InputType, Int, PartialType } from '@nestjs/graphql';
import {
  LAUNDRY_BOOKING_TYPE,
  LAUNDRY_REQUEST_STATUS,
} from 'src/database/models/laundry.model';
import { GenericListInput } from 'src/shared/graphql/entities/main.dto';
import enumToString from 'src/shared/utils/enumTostring';

@InputType()
export class ListInputLaundryBooking extends PartialType(GenericListInput) {
  @Field(() => [ID], { nullable: true })
  laundryBookingIds?: string[];

  @Field(() => [Int], {
    nullable: true,
    description: enumToString(LAUNDRY_REQUEST_STATUS),
  })
  requestStatusFilter?: number[];

  @Field(() => Int, { nullable: true })
  monthlyFilter?: number;

  @Field(() => [Int], {
    nullable: true,
    description: enumToString(LAUNDRY_BOOKING_TYPE),
  })
  bookingTypeFilter?: number[];

  @Field(() => [ID], { nullable: true })
  createdUserIds?: string[];

  @Field(() => [ID], { nullable: true })
  propertyIds?: string[];

  @Field(() => [ID], { nullable: true })
  guestIds?: string[];
}
