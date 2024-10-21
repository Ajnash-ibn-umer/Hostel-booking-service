import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { AmountStatus } from 'src/database/models/damage-and-split.model';

@InputType()
export class DamageAndSplitDetailsInput {
  @Field(() => ID, { nullable: false })
  userId: string;

  @Field(() => Int, { nullable: false })
  amount: number;
}

@InputType()
export class CreateDamageAndSplitInput {
  @Field(() => ID, { nullable: false })
  hostelId: string;

  @Field({ nullable: false })
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  documentUrl: string;

  @Field(() => Int, { nullable: false })
  totalAmount: number;

  @Field({ nullable: true })
  dueDate: Date;

  @Field(() => [DamageAndSplitDetailsInput], { nullable: true })
  splitDetails: DamageAndSplitDetailsInput[];
}
