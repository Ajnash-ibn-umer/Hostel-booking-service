import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  Info,
} from '@nestjs/graphql';
import { RoomTypeService } from './room-type.service';
import { RoomType, RoomTypeListResponse } from './entities/room-type.entity';
import { CreateRoomTypeInput } from './dto/create-room-type.input';
import { UpdateRoomTypeInput } from './dto/update-room-type.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
import { ListInputRoomType } from './dto/list-room-type.input';
import { GraphQLResolveInfo } from 'graphql';
import getProjection from 'src/shared/graphql/queryProjection';
import { generalResponse } from 'src/shared/graphql/entities/main.entity';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';

@UseGuards(AuthGuard)
@Resolver(() => RoomType)
export class RoomTypeResolver {
  constructor(private readonly roomTypeService: RoomTypeService) {}
  @Mutation(() => RoomType, { name: 'RoomType_Create' })
  @UserTypes([USER_TYPES.ADMIN])
  createRoomType(
    @Args('createRoomTypeInput') createRoomTypeInput: CreateRoomTypeInput,
    @Context() context,
  ) {
    return this.roomTypeService.create(
      createRoomTypeInput,
      context.req.user.userId,
    );
  }

  @UserTypes([USER_TYPES.ADMIN])
  @Mutation(() => RoomType, { name: 'RoomType_Update' })
  updateRoomType(
    @Args('updateRoomTypeInput') updateRoomTypeInput: UpdateRoomTypeInput,
    @Context() context,
  ) {
    return this.roomTypeService.update(
      updateRoomTypeInput,
      context.req.user.userId,
    );
  }

  @UserTypes([USER_TYPES.ADMIN])
  @Mutation(() => generalResponse, { name: 'RoomType_StatusChange' })
  statusChangeRoomType(
    @Args('statusChangeInput') statusChangeInput: statusChangeInput,
    @Context() context,
  ) {
    return this.roomTypeService.statusChange(
      statusChangeInput,
      context.req.user.userId,
    );
  }

  @UserTypes([USER_TYPES.PUBLIC, USER_TYPES.ADMIN, USER_TYPES.USER])
  @Query(() => RoomTypeListResponse, { name: 'RoomType_List' })
  async listRoomTypes(
    @Args('listInput') listInput: ListInputRoomType,
    @Context() context,
    @Info() info: GraphQLResolveInfo,
  ) {
    const projection = getProjection(info.fieldNodes[0]);

    return this.roomTypeService.listRoomTypes(listInput, projection);
  }
}
