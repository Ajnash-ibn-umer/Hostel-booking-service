import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Hostel {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
