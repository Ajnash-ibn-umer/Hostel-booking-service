import { Field, ID, InputType, Int, PartialType } from '@nestjs/graphql';
import { AmountStatus } from 'src/database/models/damage-and-split.model';
import {
  DateRangeInput,
  GenericListInput,
} from 'src/shared/graphql/entities/main.dto';
import enumToString from 'src/shared/utils/enumTostring';

@InputType()
export class ListInputDamageAndSpit extends PartialType(GenericListInput) {
  @Field(() => [ID], { nullable: true })
  damageAndSplitIds: string[];

  @Field(() => [ID], { nullable: true })
  hostelIds: string[];

  @Field(() => [ID], { nullable: true })
  userIds: string[];

  @Field(() => DateRangeInput, {
    nullable: true,
  })
  dueDateFilter: DateRangeInput;

  @Field(() => [Int], {
    nullable: true,
    description: enumToString(AmountStatus),
  })
  amountStatusFilter: number[];
}
