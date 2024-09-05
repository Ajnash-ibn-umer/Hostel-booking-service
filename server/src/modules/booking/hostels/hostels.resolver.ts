import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  GraphQLExecutionContext,
  GqlContextType,
} from '@nestjs/graphql';
import { HostelsService } from './services/hostels.service';
import { Hostel } from './entities/hostel.entity';
import { CreateHostelInput } from './dto/create-hostel.input';
import { UpdateHostelInput } from './dto/update-hostel.input';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
@UseGuards(AuthGuard)
@Resolver(() => Hostel)
export class HostelsResolver {
  constructor(private readonly hostelsService: HostelsService) {}

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
}
