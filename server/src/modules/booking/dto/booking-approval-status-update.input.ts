import { Field, ID, InputType } from '@nestjs/graphql';
import { BOOKING_STATUS } from 'src/database/models/booking.model';
import enumToString from 'src/shared/utils/enumTostring';

@InputType()
export class AdminBookingStatusChangeInput {
  @Field(() => ID)
  bookingIds: string;

  @Field(() => ID)
  selectedBedId?: string;

  @Field({ description: enumToString(BOOKING_STATUS), nullable: false })
  status: BOOKING_STATUS;

  @Field({ nullable: true })
  remark?: string;

  @Field({ nullable: true })
  date: string;
}
