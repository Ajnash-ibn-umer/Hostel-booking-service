import { ObjectType, Field, Int, PartialType } from '@nestjs/graphql';
import { User } from 'src/modules/user/entities/user.entity';
import { Base } from 'src/shared/graphql/entities/main.entity';

@ObjectType()
export class PropertyCategory extends PartialType(Base) {
  @Field(() => String, {
    description: 'Name of the property category',
    nullable: true,
  })
  name: string | null;

  @Field(() => String, {
    description: 'Description of the property category',
    nullable: true,
  })
  description: string | null;

  @Field(() => String, {
    description: 'Slug for the property category',
    nullable: true,
  })
  slug: string | null;

  @Field(() => String, {
    description: 'Icon representing the property category',
    nullable: true,
  })
  icon: string | null;

  @Field(() => User, {
    nullable: true,
  })
  createdUser: User;
}

@ObjectType()
export class ListCategoryResponse {
  @Field(() => [PropertyCategory], { nullable: true })
  list: PropertyCategory[] | null;

  @Field(() => Int, { nullable: true })
  totalCount: number | null;
}
