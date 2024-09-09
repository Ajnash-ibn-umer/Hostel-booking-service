import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RoomType {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
