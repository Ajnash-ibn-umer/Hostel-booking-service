import { ObjectType, Field, ID, Int, PartialType } from '@nestjs/graphql';
import { Base } from 'src/shared/graphql/entities/main.entity';
import {
  AVAILABILITY_STATUS,
  PRICE_BASE_MODE,
} from 'src/database/models/hostel.model';
import enumToString from 'src/shared/utils/enumTostring';
import { BED_POSITION } from 'src/shared/variables/main.variable';

@ObjectType()
export class Bed extends PartialType(Base) {
  @Field(() => String, { description: 'Name of the bed', nullable: true })
  name: string;

  @Field(() => Int, {
    description: enumToString(BED_POSITION),
    nullable: true,
  })
  bedPosition: number;

  @Field(() => Int, {
    description: enumToString(PRICE_BASE_MODE),
    nullable: true,
  })
  paymentBase: number;

  @Field(() => Int, {
    description: enumToString(AVAILABILITY_STATUS),
    nullable: true,
  })
  availabilityStatus: number;

  @Field(() => ID, { description: 'Room ID of the bed', nullable: true })
  roomId: string;

  @Field(() => ID, { description: 'Room type ID of the bed', nullable: true })
  roomTypeId: string;

  @Field(() => String, {
    description: 'Floor number of the bed',
    nullable: true,
  })
  floor: string;
}
