import { ObjectType, Field, Int, ID, PartialType } from '@nestjs/graphql';
import { Base } from 'src/shared/graphql/entities/main.entity';

@ObjectType()
export class Amenity extends PartialType(Base) {
  @Field(() => String, {
    description: 'The name of the amenity',
    nullable: true,
  })
  name: string;

  @Field(() => String, {
    description: 'The description of the amenity',
    nullable: true,
  })
  description: string;

  @Field(() => String, {
    description: 'The slug of the amenity',
    nullable: true,
  })
  slug: string;

  @Field(() => String, {
    description: 'The icon of the amenity',
    nullable: true,
  })
  icon: string;
}
@ObjectType()
export class AmenityListResponse {
  @Field(() => [Amenity], { nullable: true })
  list: Amenity[];

  @Field(() => Int, { nullable: true })
  totalCount: number;
}
