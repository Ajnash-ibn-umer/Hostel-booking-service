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

@InputType()
export class ListInputHostel extends PartialType(GenericListInput) {
  @Field(() => [ID], { nullable: true })
  hostelIds: string[];

  @Field(() => [ID], { nullable: true })
  categoryIds: string[];

  @Field(() => [ID], { nullable: true })
  locationIds: string[];

  @Field(() => [ID], { nullable: true })
  amenityIds: string[];

  @Field(() => [String], { nullable: true })
  propertyNumberFilter: string[];

  @Field(() => [Int], {
    nullable: true,
    description: enumToString(AVAILABILITY_STATUS),
  })
  availblityStatusFilter: number[];

  @Field(() => [Int], {
    nullable: true,
    description: enumToString(PRICE_BASE_MODE),
  })
  priceBaseModeFilter: number[];

  @Field(() => RangeInput, {
    nullable: true,
    description: 'Price range filter',
  })
  priceRangeFilter: RangeInput;
}
