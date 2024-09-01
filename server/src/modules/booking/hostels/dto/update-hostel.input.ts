import { CreateHostelInput } from './create-hostel.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateHostelInput extends PartialType(CreateHostelInput) {
  @Field(() => Int)
  id: number;
}
