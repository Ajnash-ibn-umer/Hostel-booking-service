import { CreateDamageAndSplitInput } from './create-damage_and_split.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class PayUpdateDamageAndSplitInput {
  @Field(() => ID)
  _id: string;

  @Field(() => Number)
  payedAmount: number;

  @Field(() => ID)
  paymentId: string;

  @Field(() => ID)
  userId: string;
}
