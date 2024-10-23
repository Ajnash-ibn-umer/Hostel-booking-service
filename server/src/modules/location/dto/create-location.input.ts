import { InputType, Int, Field } from '@nestjs/graphql';
import { tree } from 'next/dist/build/templates/app-page';

@InputType()
export class PointInput {
  @Field(() => String, { description: 'Type of the point' })
  type: string;

  @Field(() => [Number], { description: 'Coordinates of the point' })
  coordinates: number[];
}

@InputType()
export class CreateLocationInput {
  @Field(() => String, { description: 'Name of the location' })
  name: string;

  @Field(() => PointInput, {
    description: 'GPS location of the location',
    nullable: true,
  })
  gps_location: PointInput;

  @Field(() => String, {
    nullable: true,
  })
  locationLink: string;
}
