import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRoomTypeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
