import { ObjectType, Field, ID, PartialType } from '@nestjs/graphql';
import { Base } from 'src/shared/graphql/entities/main.entity';
import { Bed } from './bed.entity';

@ObjectType()
export class Room extends PartialType(Base) {
  @Field(() => String, { description: 'Name of the room', nullable: true })
  name: string;

  @Field(() => String, { description: 'Slug of the room', nullable: true })
  slug: string;

  @Field(() => ID, { description: 'Room type ID', nullable: true })
  roomTypeId: string;

  @Field(() => String, {
    description: 'Floor number of the room',
    nullable: true,
  })
  floor: string;

  @Field(() => ID, {
    description: 'Property ID of the room',
    nullable: true,
  })
  propertyId: string;

  @Field(() => Number, {
    description: 'Total number of beds in the room',
    nullable: true,
  })
  totalBeds: number;

  @Field(() => [Bed], { nullable: true })
  beds: Bed[];
}
