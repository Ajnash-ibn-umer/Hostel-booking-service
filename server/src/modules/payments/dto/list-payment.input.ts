import { Field, ID, InputType, Int, PartialType } from '@nestjs/graphql';
import { AmountStatus } from 'src/database/models/damage-and-split.model';
import {
  PaymentStatus,
  VOUCHER_TYPE,
} from 'src/database/models/payments.model';
import {
  DateRangeInput,
  GenericListInput,
} from 'src/shared/graphql/entities/main.dto';
import enumToString from 'src/shared/utils/enumTostring';

@InputType()
export class ListInputPayments extends PartialType(GenericListInput) {
  @Field(() => [ID], { nullable: true })
  paymentIds: string[];

  @Field(() => [Int], {
    nullable: true,
    description: enumToString(PaymentStatus),
  })
  paymentStatusFilter: number[];

  @Field(() => [ID], { nullable: true })
  userIds: string[];

  @Field(() => DateRangeInput, {
    nullable: true,
  })
  dueDateFilter: DateRangeInput;

  @Field(() => DateRangeInput, {
    nullable: true,
  })
  payedDateFilter: DateRangeInput;

  @Field(() => [Int], {
    nullable: true,
    description: enumToString(VOUCHER_TYPE),
  })
  voucherTypeFilter: number[];
}
