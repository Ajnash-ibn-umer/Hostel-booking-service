import { InputType, Int, Field, ID } from '@nestjs/graphql';
import {
  AVAILABILITY_STATUS,
  PRICE_BASE_MODE,
} from 'src/database/models/hostel.model';
import enumToString from 'src/shared/utils/enumTostring';
import { BED_POSITION } from 'src/shared/variables/main.variable';

@InputType()
export class CreateBedInput {
  @Field(() => ID, { nullable: true, description: 'Only Use in Update' })
  _id: string;

  @Field(() => String, { description: 'Name  of the bed', nullable: false })
  name: string;

  @Field(() => Int, {
    description: enumToString(BED_POSITION),
    nullable: false,
  })
  bedPosition: number;

  @Field(() => Int, {
    description: enumToString(PRICE_BASE_MODE),
    nullable: false,
  })
  paymentBase: number;

  @Field(() => Int, {
    description: enumToString(AVAILABILITY_STATUS),
    nullable: true,
  })
  availabilityStatus: number;

  @Field(() => ID, { description: 'Room type ID of the bed', nullable: true })
  roomTypeId: string;

  @Field(() => String, {
    description: 'Floor number of the bed',
    nullable: true,
  })
  floor: string;
}

@InputType()
export class CreateRoomInput {
  @Field(() => ID, { nullable: true, description: 'Only Use in Update' })
  _id: string;

  @Field(() => String, { description: 'Name of the room', nullable: false })
  name: string;

  @Field(() => ID, { description: 'Room type ID', nullable: true })
  roomTypeId: string;

  @Field(() => String, {
    description: 'Floor number of the room',
    nullable: true,
  })
  floor: string;

  @Field(() => Number, {
    description: 'Total number of beds in the room',
    nullable: true,
  })
  totalBeds: number;

  @Field(() => [CreateBedInput], {
    description: 'Total number of beds in the room',
    nullable: true,
  })
  beds: CreateBedInput[];

  @Field(() => [ID], { nullable: true })
  galleryIds: string[];

  @Field(() => [ID], { nullable: true })
  aminityIds: string[];
}

@InputType()
export class CreateHostelInput {
  @Field(() => String, { description: 'Name of the hostel', nullable: true })
  name: string;

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

  @Field(() => [CreateRoomInput], { nullable: true })
  rooms?: CreateRoomInput[];

  @Field(() => ID, { nullable: true })
  categoryId: string;

  @Field(() => [ID], { nullable: true })
  galleryIds: string[];

  @Field(() => [ID], { nullable: true })
  aminityIds: string[];
}
