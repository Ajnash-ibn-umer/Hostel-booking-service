import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RentCalculatorResponse {
  @Field({ nullable: false, defaultValue: false })
  bedAvailablity: boolean;

  @Field({ nullable: true })
  message: string;

  @Field(() => ID, { nullable: true })
  roomId?: string;

  @Field(() => ID, { nullable: true })
  tempSelectedBedId?: string;

  @Field({ nullable: true, defaultValue: 0 })
  rent: number;

  @Field({ nullable: true, defaultValue: 0 })
  securityDeposit: number;
}
