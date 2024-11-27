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
}
