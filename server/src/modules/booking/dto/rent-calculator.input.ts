import { Field, ID, InputType } from '@nestjs/graphql';
import { PRICE_BASE_MODE } from 'src/database/models/hostel.model';
import enumToString from 'src/shared/utils/enumTostring';
import { BED_POSITION } from 'src/shared/variables/main.variable';

@InputType()
export class RentCalculatorInput {
  @Field(() => ID, { description: 'Room ID' })
  roomId: string;

  @Field({ description: enumToString(BED_POSITION) })
  bedPosition: number;

  @Field({ description: enumToString(PRICE_BASE_MODE) })
  paymentBase: number;
}
