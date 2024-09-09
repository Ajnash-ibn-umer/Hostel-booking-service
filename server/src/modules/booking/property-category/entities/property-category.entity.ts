import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PropertyCategory {
  @Field(() => Int, { description: 'Name of the property category' })
  name: string;

  @Field(() => String, { description: 'Description of the property category' })
  description: string;

  @Field(() => String, { description: 'Slug for the property category' })
  slug: string;

  @Field(() => String, {
    description: 'Icon representing the property category',
  })
  icon: string;
}
