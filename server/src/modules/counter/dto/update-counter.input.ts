import { CreateCounterInput } from './create-counter.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCounterInput  {
  @Field(() => String, { nullable: false })
  entityName: string;

  @Field(() => Int, { nullable: true })
  count: number;

}


@InputType()
export class GetCounterByEntityNameInput  {
  @Field(() => String, { nullable: false })
  entityName: string;


}
