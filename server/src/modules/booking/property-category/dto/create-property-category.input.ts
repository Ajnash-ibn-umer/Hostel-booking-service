import { InputType, Int, Field } from '@nestjs/graphql';

import { Category } from 'src/database/models/category.model';

@InputType()
export class CreatePropertyCategoryInput implements Partial<Category> {
  @Field({ description: 'Name of the property category' })
  name: string;

  @Field({
    description: 'Description of the property category',
    nullable: true,
  })
  description: string;

  @Field({ description: 'Slug for the property category' })
  slug: string;

  @Field({
    description: 'Icon representing the property category',
    nullable: true,
  })
  icon: string;
}
