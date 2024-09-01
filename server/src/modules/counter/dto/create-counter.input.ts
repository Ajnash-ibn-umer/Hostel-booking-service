import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCounterInput {

  @Field(() => String, { nullable: true })
  entityName: string;

  @Field(() => String, { nullable: true })
  prefix: string;

  @Field(() => String, { nullable: true })
  suffix: string;


}
