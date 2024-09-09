import { ObjectType, Field, Int, ID, PartialType } from '@nestjs/graphql';
import {
  AVAILABILITY_STATUS,
  PRICE_BASE_MODE,
} from 'src/database/models/hostel.model';
import { Base } from 'src/shared/graphql/entities/main.entity';
import enumToString from 'src/shared/utils/enumTostring';
import { Room } from './room.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Amenity } from '../../amenities/entities/amenity.entity';

@ObjectType()
export class Hostel extends PartialType(Base) {
  @Field(() => String, { description: 'Name of the hostel', nullable: true })
  name: string;

  @Field(() => String, {
    description: 'Property number of the hostel',
    nullable: true,
  })
  propertyNo: string;

  @Field(() => String, { description: 'Slug of the hostel', nullable: true })
  slug: string;

  @Field(() => String, {
    description: 'Short description of the hostel',
    nullable: true,
  })
  shortDescription: string;

  @Field(() => String, {
    description: 'Description of the hostel',
    nullable: true,
  })
  description: string;

  @Field(() => Number, {
    description: enumToString(AVAILABILITY_STATUS),
    nullable: true,
  })
  availabilityStatus: number;

  @Field(() => ID, { nullable: true })
  categoryId: string;

  @Field(() => ID, {
    description: 'Location ID of the hostel',
    nullable: true,
  })
  locationId: string;

  @Field(() => Number, {
    description: 'Total number of rooms in the hostel',
    nullable: true,
  })
  totalRooms: number;

  @Field(() => Number, {
    description: 'Total number of beds in the hostel',
    nullable: true,
  })
  totalBeds: number;

  @Field(() => Number, {
    description: 'Selling price of the hostel',
    nullable: true,
  })
  sellingPrice: number;

  @Field(() => Number, {
    description: 'Standard price of the hostel',
    nullable: true,
  })
  standardPrice: number;

  @Field(() => Number, {
    description: enumToString(PRICE_BASE_MODE),

    nullable: true,
  })
  priceBaseMode: number;

  @Field(() => [Room], { nullable: true })
  rooms: Room[];

  @Field(() => User, { nullable: true })
  createdUser?: User;

  @Field(() => User, { nullable: true })
  updatedUser?: User;

  @Field(() => [Amenity], { nullable: true })
  amenities: Amenity[];

  // @Field(() => [Gallery], { nullable: true })
  // galleries: Gallery[];
  // TODO: Gallery Entity Link
  // TODO: Amenity Entity link
}
@ObjectType()
export class ListHostelsResponse {
  @Field(() => [Hostel], { nullable: true })
  list: Hostel[];

  @Field({ nullable: true })
  totalCount: number;
}
