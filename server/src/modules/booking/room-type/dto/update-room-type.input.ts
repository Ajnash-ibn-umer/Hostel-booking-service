import { CreateRoomTypeInput } from './create-room-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRoomTypeInput extends PartialType(CreateRoomTypeInput) {
  @Field(() => Int)
  id: number;
}
