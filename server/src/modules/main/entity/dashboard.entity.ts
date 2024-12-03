import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DashboardStats {
  @Field(() => Int, { nullable: true })
  roomCount: number | null;

  @Field(() => Int, { nullable: true })
  userCount: number | null;

  @Field(() => Int, { nullable: true })
  complaintCount: number | null;

  @Field(() => Int, { nullable: true })
  paymentCount: number | null;
}
