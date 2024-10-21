import { CreateDamageAndSplitInput } from './create-damage_and_split.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDamageAndSplitInput extends PartialType(CreateDamageAndSplitInput) {
  @Field(() => Int)
  id: number;
}
