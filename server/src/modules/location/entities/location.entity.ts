import { ObjectType, Field, Int, PartialType } from '@nestjs/graphql';
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
}
