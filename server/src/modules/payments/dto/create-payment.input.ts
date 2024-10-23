import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { VOUCHER_TYPE } from 'src/database/models/payments.model';
import enumToString from 'src/shared/utils/enumTostring';

@InputType()
export class CreatePaymentInput {
  @Field(() => Int, { nullable: true, description: enumToString(VOUCHER_TYPE) })
  voucherType: number;

  @Field({ nullable: true })
  dueDate: Date;

  @Field(() => String)
  voucherId: string;

  @Field({ nullable: true })
  payAmount: number;

  @Field(() => ID)
  userId: string;
}
