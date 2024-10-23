import {
  Field,
  ID,
  InputType,
  Int,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { BookingCreateInput } from './create-booking.input';

@InputType()
export class UpdateBookingInput extends OmitType(BookingCreateInput, [
  'basePrice',
  'netAmount',
  'discountAmount',
  'taxPer',
  'taxId',
  'taxAmount',
  'securityDeposit',
  'grossAmount',
  'netAmount',
  'otherAmount',
]) {
  @Field(() => ID)
  _id: string;
}
