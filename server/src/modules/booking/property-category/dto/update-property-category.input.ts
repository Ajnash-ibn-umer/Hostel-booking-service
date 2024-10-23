import { CreatePropertyCategoryInput } from './create-property-category.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdatePropertyCategoryInput extends PartialType(
  CreatePropertyCategoryInput,
) {
  @Field(() => ID)
  _id: string;
}
