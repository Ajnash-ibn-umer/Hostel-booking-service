import { CreateRoomTypeInput } from './create-room-type.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateRoomTypeInput extends PartialType(CreateRoomTypeInput) {
  @Field(() => ID)
  _id: string;
}
