import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoomTypeService } from './room-type.service';
import { RoomType } from './entities/room-type.entity';
import { CreateRoomTypeInput } from './dto/create-room-type.input';
import { UpdateRoomTypeInput } from './dto/update-room-type.input';

@Resolver(() => RoomType)
export class RoomTypeResolver {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @Mutation(() => RoomType)
  createRoomType(@Args('createRoomTypeInput') createRoomTypeInput: CreateRoomTypeInput) {
    return this.roomTypeService.create(createRoomTypeInput);
  }

  @Query(() => [RoomType], { name: 'roomType' })
  findAll() {
    return this.roomTypeService.findAll();
  }

  @Query(() => RoomType, { name: 'roomType' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.roomTypeService.findOne(id);
  }

  @Mutation(() => RoomType)
  updateRoomType(@Args('updateRoomTypeInput') updateRoomTypeInput: UpdateRoomTypeInput) {
    return this.roomTypeService.update(updateRoomTypeInput.id, updateRoomTypeInput);
  }

  @Mutation(() => RoomType)
  removeRoomType(@Args('id', { type: () => Int }) id: number) {
    return this.roomTypeService.remove(id);
  }
}
