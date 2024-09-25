import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  GraphQLExecutionContext,
  GqlContextType,
  Info,
} from '@nestjs/graphql';
import { HostelsService } from './services/hostels.service';
import { Hostel, ListHostelsResponse } from './entities/hostel.entity';
import { CreateHostelInput } from './dto/create-hostel.input';
import { UpdateHostelInput } from './dto/update-hostel.input';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
import { ListInputHostel } from './dto/list-hostel.input';
import { GraphQLResolveInfo } from 'graphql';
import getProjection from 'src/shared/graphql/queryProjection';
import { RoomsService } from './services/rooms.service';
import { RoomListResponse } from './entities/room.entity';
import { ListInputRoom } from './dto/list-room.input';

@UseGuards(AuthGuard)
@Resolver(() => Hostel)
export class HostelsResolver {
  constructor(
    private readonly hostelsService: HostelsService,
    private readonly roomService: RoomsService,
  ) {}

  @Mutation(() => Hostel, { name: 'Hostel_Create' })
  @UserTypes([USER_TYPES.ADMIN])
  createHostel(
    @Args('createHostelInput') createHostelInput: CreateHostelInput,
    @Context() context,
  ) {
    console.log({ req: context.req.user });
    return this.hostelsService.create(
      createHostelInput,
      context.req.user.userId,
    );
  }

  @Mutation(() => Hostel, { name: 'Hostel_Update' })
  @UserTypes([USER_TYPES.ADMIN])
  updateHostel(
    @Args('updateHostelInput') updateHostelInput: UpdateHostelInput,
    @Context() context,
  ) {
    return this.hostelsService.update(
      updateHostelInput,
      context.req.user.userId,
    );
  }

  @Mutation(() => String, { name: 'Hostel_StatusChange' })
  @UserTypes([USER_TYPES.ADMIN])
  statusChange(
    @Args('statusChangeInput') statusChangeInput: statusChangeInput,
    @Context() context,
  ) {
    return this.hostelsService.statusChange(
      statusChangeInput,
      context.req.user.userId,
    );
  }

  @Query(() => ListHostelsResponse, { name: 'Hostel_List' })
  @UserTypes([USER_TYPES.ADMIN, USER_TYPES.USER, USER_TYPES.PUBLIC])
  listHostels(
    @Args('listInputHostel') listInputHostel: ListInputHostel,
    @Info() info: GraphQLResolveInfo,
  ) {
    const projection = getProjection(info.fieldNodes[0]);

    return this.hostelsService.listHostels(listInputHostel, projection);
  }

  @Query(() => RoomListResponse, { name: 'Room_List' })
  @UserTypes([USER_TYPES.ADMIN, USER_TYPES.USER, USER_TYPES.PUBLIC])
  listRooms(
    @Args('listInputRoom') listInputRoom: ListInputRoom,
    @Info() info: GraphQLResolveInfo,
  ) {
    const projection = getProjection(info.fieldNodes[0]);

    return this.roomService.listRoom(listInputRoom, projection);
  }
}
