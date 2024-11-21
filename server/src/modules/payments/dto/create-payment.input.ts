import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { VOUCHER_TYPE } from 'src/database/models/payments.model';
import { PAYMENT_STATUS } from 'src/database/models/transaction.model';
import enumToString from 'src/shared/utils/enumTostring';

@InputType()
export class CreatePaymentInput {
  @Field(() => Int, { nullable: true, description: enumToString(VOUCHER_TYPE) })
  voucherType: number;

  @Field(() => Int, {
    nullable: true,
    description: enumToString(PAYMENT_STATUS),
  })
  paymentStatus?: number;

  @Field({ nullable: true })
  dueDate: Date;

  @Field({ nullable: true })
  payedDate?: Date;

  @Field(() => String)
  voucherId: string;

  @Field(() => String)
  remark: string;

  @Field({ nullable: true })
  payAmount: number;

  @Field(() => ID)
  userId: string;
}
