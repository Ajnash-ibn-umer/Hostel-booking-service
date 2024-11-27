import enumToString from 'src/shared/utils/enumTostring';
import { CreateCheckoutInput } from './create-checkout.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { CHECKOUT_APPROVAL_STATUS } from 'src/database/models/checkout-request.model';

@InputType()
export class UpdateCHeqoutRequestApprovalStatus {
  @Field(() => ID)
  chequoutRequestId: string;

  @Field(() => String, { nullable: true })
  remark: string;

  @Field(() => Int, {
    nullable: true,
    description: enumToString(CHECKOUT_APPROVAL_STATUS),
  })
  requestStatus: number;
}

@InputType()
export class ForcedCheckoutInput {
  @Field(() => ID)
  guestId: string;

  @Field(() => String, { nullable: true })
  remark: string;

  @Field(() => ID)
  contractId: string;

  @Field(() => ID)
  bedId: string;
}
