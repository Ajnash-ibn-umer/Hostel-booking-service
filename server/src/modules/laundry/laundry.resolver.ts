import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  Info,
} from '@nestjs/graphql';
import { LaundryService } from './laundry.service';
import { LaundryListResponse } from './entities/laundry.entity';
import { CreateLaundryBookingInput } from './dto/create-laundry.input';
import { UpdateLaundryBookingInput } from './dto/update-laundry.input';
import { LaundryBooking } from 'src/database/models/laundry.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { ListInputLaundryBooking } from './dto/list-laundry-booking.input';
import { GraphQLResolveInfo } from 'graphql';
import getProjection from 'src/shared/graphql/queryProjection';

@UseGuards(AuthGuard)
@Resolver(() => LaundryBooking)
export class LaundryResolver {
  constructor(private readonly laundryService: LaundryService) {}

  @UserTypes([USER_TYPES.USER, USER_TYPES.ADMIN])
  @Mutation(() => LaundryBooking, { name: 'LaundryBooking_Create' })
  createLaundry(
    @Args('createLaundryInput') createLaundryInput: CreateLaundryBookingInput,
    @Context() context,
  ) {
    const userId = context.req.user.userId;

    return this.laundryService.create(createLaundryInput, userId);
  }

  @UserTypes([USER_TYPES.USER, USER_TYPES.ADMIN])
  @Query(() => LaundryListResponse, { name: 'LaundryBooking_List' })
  listLaundryBookings(
    @Args('listInputLaundryBooking') dto: ListInputLaundryBooking,
    @Info() info: GraphQLResolveInfo,
    @Context() context,
  ) {
    const userId = context.req.user.userId;
    const projection = getProjection(info.fieldNodes[0]);
    if (context.req.user.userType === USER_TYPES.USER) {
      dto.guestIds = [...(dto.guestIds ?? []), userId];
    }
    return this.laundryService.listLaundryBookings(dto, projection);
  }
}
