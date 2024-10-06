import { Field, ID, InputType, Int, PartialType } from '@nestjs/graphql';
import {
  AVAILABILITY_STATUS,
  PRICE_BASE_MODE,
} from 'src/database/models/hostel.model';
import {
  GenericListInput,
  RangeInput,
} from 'src/shared/graphql/entities/main.dto';
import enumToString from 'src/shared/utils/enumTostring';
import { BED_POSITION } from 'src/shared/variables/main.variable';

@InputType()
export class BedFilterOptions {
  @Field(() => [ID], { nullable: true })
  bedIds?: string[];

  @Field(() => [Int], {
    nullable: true,
    description: enumToString(AVAILABILITY_STATUS),
  })
  availabilityStatus?: AVAILABILITY_STATUS[];

  @Field(() => [Int], {
    nullable: true,
    description: enumToString(PRICE_BASE_MODE),
  })
  priceBaseModes?: PRICE_BASE_MODE[];

  @Field(() => [Int], {
    nullable: true,
    description: enumToString(BED_POSITION),
  })
  bedPositions?: BED_POSITION[];
}

@InputType()
export class ListInputRoom extends PartialType(GenericListInput) {
  @Field(() => [ID], { nullable: true })
  hostelIds: string[];

  @Field(() => [ID], { nullable: true })
  roomTypeIds: string[];

  @Field(() => [ID], { nullable: true })
  amenityIds: string[];

  @Field(() => [ID], { nullable: true })
  roomIds: string[];

  @Field(() => BedFilterOptions, { nullable: true })
  bedFilters: BedFilterOptions;
}
