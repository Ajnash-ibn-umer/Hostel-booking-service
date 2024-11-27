import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCheckoutInput {
  @Field({ nullable: true })
  vaccatingDate: Date;

  @Field(() => String, { nullable: false })
  bookingId: string;

  @Field(() => String, { nullable: false })
  contractId: string;

  @Field(() => String, { nullable: true })
  guestId: string;

  @Field(() => String, { nullable: false })
  guestNo: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => String, { nullable: false })
  hostelId: string;

  @Field(() => String, { nullable: false })
  roomId: string;

  @Field(() => String, { nullable: false })
  bedId: string;
}
