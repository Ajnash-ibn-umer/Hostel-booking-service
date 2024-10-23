import { ObjectType, Field, Int, PartialType } from '@nestjs/graphql';
import { User } from 'src/modules/user/entities/user.entity';
import { Base } from 'src/shared/graphql/entities/main.entity';

@ObjectType()
export class Point {
  @Field(() => String, { description: 'Type of the point' })
  type: string;

  @Field(() => [Number], { description: 'Coordinates of the point' })
  coordinates: number[];
}

@ObjectType()
export class Location extends PartialType(Base) {
  @Field(() => String, { description: 'Name of the location' })
  name: string;

  @Field(() => Point, {
    description: 'GPS location of the location',
    nullable: true,
  })
  gps_location: Point;

  @Field(() => String, {
    nullable: true,
  })
  locationLink: string;

  @Field(() => User, {
    nullable: true,
  })
  createdUser: User;
}

@ObjectType()
export class LocationListResponse {
  @Field(() => [Location], { description: 'List of locations' })
  list: Location[];

  @Field(() => Int, { description: 'Total count of locations' })
  totalCount: number;
}
