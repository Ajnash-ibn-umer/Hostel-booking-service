import { CreateLaundryBookingInput } from './create-laundry.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateLaundryBookingInput extends PartialType(
  CreateLaundryBookingInput,
) {
  @Field(() => ID)
  _id: string;
}
