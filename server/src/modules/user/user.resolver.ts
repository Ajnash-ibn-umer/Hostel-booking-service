import { Resolver, Query, Mutation, Args, Int, Info, Context } from '@nestjs/graphql';
import { UserService } from './service/user.service';
import { ListUsersResponse, User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { ListUserInput } from './dto/list-user.input';
import { GraphQLResolveInfo } from 'graphql';
import getProjection from 'src/shared/graphql/queryProjection';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User,{name:"User_Create"})
  createCustomerUser(@Args('createUserInput') dto: CreateUserInput) {
    
    dto['userType'] = USER_TYPES.USER;
    return this.userService.create(dto);
  }

  @Mutation(() => User,{name:"User_Admin_Create"})
  createAdminUser(@Args('createUserInput') dto: CreateUserInput) {
    
    dto['userType'] = USER_TYPES.ADMIN;
    return this.userService.create(dto);
  }


  @Query(() => ListUsersResponse,{name:"User_List"})
  listUser(@Args('listUserInput') dto: ListUserInput,
  @Info() info: GraphQLResolveInfo,
  @Context() context,
  ) {
    
    dto['userType'] = USER_TYPES.ADMIN;

    const projection = getProjection(info.fieldNodes[0]);

    return this.userService.list(dto,projection);
  }
}
