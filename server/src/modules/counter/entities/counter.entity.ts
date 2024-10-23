import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Counter {
  @Field(() => String, { nullable: true })
  _id: string;

  @Field(() => Int, { nullable: true })
  count: number;

  @Field(() => String, { nullable: true })
  entityName: string;

  @Field(() => String, { nullable: true })
  prefix: string;

  @Field(() => String, { nullable: true })
  suffix: string;

  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @Field(() => Int, { nullable: true })
  status: number;

  @Field(() => String, { nullable: true })
  uid: string;
}
