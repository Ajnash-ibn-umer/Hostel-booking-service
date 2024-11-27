import { Field, ID, InputType, Int, PartialType } from '@nestjs/graphql';
import { CHECKOUT_APPROVAL_STATUS } from 'src/database/models/checkout-request.model';
import { REQUEST_STATUS } from 'src/database/models/complaints.model';
import { GenericListInput } from 'src/shared/graphql/entities/main.dto';
import enumToString from 'src/shared/utils/enumTostring';

@InputType()
export class ListInputCheckoutRequest extends PartialType(GenericListInput) {
  @Field(() => [ID], { nullable: true })
  checkoutReqIds?: string[];

  @Field(() => [Int], {
    nullable: true,
    description: enumToString(CHECKOUT_APPROVAL_STATUS),
  })
  requestStatus?: number[];

  @Field(() => [ID], { nullable: true })
  roomIds?: string[];

  @Field(() => [ID], { nullable: true })
  createdUserIds?: string[];

  @Field(() => [ID], { nullable: true })
  propertyIds?: string[];

  @Field(() => [ID], { nullable: true })
  bedIds?: string[];

  @Field(() => [ID], { nullable: true })
  contractIds?: string[];

  @Field(() => [ID], { nullable: true })
  guestIds?: string[];
}
