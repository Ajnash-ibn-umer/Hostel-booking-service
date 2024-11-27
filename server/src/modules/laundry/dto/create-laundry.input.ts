import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLaundryBookingInput {
  @Field(() => Date, { nullable: true })
  bookingDate: Date;

  @Field(() => Int, { nullable: true })
  timeSlot: number;

  @Field(() => Int, {
    nullable: true,
    description: '1=free ,2=payed',
  })
  bookingType: number;
}
