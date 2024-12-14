import enumToString from 'src/shared/utils/enumTostring';
import { PaymentStatus } from '../../../database/models/payments.model';
import { CreatePaymentInput } from './create-payment.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdatePaymentInput extends PartialType(CreatePaymentInput) {
  @Field(() => Int)
  id: number;
}

@InputType()
export class UpdatePaymentApprovalStatus {
  @Field(() => ID)
  paymentId: string;

  @Field(() => Int, {
    nullable: true,
    description: enumToString(PaymentStatus),
  })
  requestStatus: number;

  @Field(() => String, { nullable: true })
  order_uuid: string;

  @Field(() => String, { nullable: true })
  razorPay_orderId: string;

  @Field(() => String, { nullable: true })
  razorPay_signature: string;

  @Field(() => String, { nullable: true })
  razorPay_paymentId: string;

  
  @Field(() => Number, { nullable: false })
  payedAmount: number;
}
