import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAmenityInput {
  @Field(() => String, { description: 'The name of the amenity' })
  name: string;

  @Field(() => String, {
    description: 'The description of the amenity',
    nullable: true,
  })
  description: string;

  @Field(() => String, {
    description: 'The icon of the amenity',
    nullable: true,
  })
  icon: string;
}
