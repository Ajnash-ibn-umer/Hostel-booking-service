import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRoomTypeInput {
  @Field({ description: 'Name of the room type' })
  name: string;

  @Field({ description: 'Description of the room type', nullable: true })
  description: string;
}
