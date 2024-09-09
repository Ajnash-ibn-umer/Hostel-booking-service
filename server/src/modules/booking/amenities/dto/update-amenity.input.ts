import { CreateAmenityInput } from './create-amenity.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateAmenityInput extends PartialType(CreateAmenityInput) {
  @Field(() => ID)
  _id: string;
}
