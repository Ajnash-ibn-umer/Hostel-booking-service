import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  Info,
} from '@nestjs/graphql';
import { LocationService } from './location.service';
import { Location, LocationListResponse } from './entities/location.entity';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
import { GraphQLResolveInfo } from 'graphql';
import getProjection from 'src/shared/graphql/queryProjection';
import { ListInputLocation } from './dto/list-locaitoninput';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { generalResponse } from 'src/shared/graphql/entities/main.entity';

@UseGuards(AuthGuard)
@Resolver(() => Location)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Mutation(() => Location, { name: 'Location_Create' })
  @UserTypes([USER_TYPES.ADMIN])
  createLocation(
    @Args('createLocationInput') createLocationInput: CreateLocationInput,
    @Context() context,
  ) {
    console.log({ req: context.req.user });
    return this.locationService.create(
      createLocationInput,
      context.req.user.userId,
    );
  }

  @Mutation(() => Location, { name: 'Location_Update' })
  @UserTypes([USER_TYPES.ADMIN])
  updateLocation(
    @Args('updateLocationInput') updateLocationInput: UpdateLocationInput,
    @Context() context,
  ) {
    return this.locationService.update(
      updateLocationInput,
      context.req.user.userId,
    );
  }

  @Mutation(() => generalResponse, { name: 'Location_StatusChange' })
  @UserTypes([USER_TYPES.ADMIN])
  statusChange(
    @Args('statusChangeInput') statusChangeInput: statusChangeInput,
    @Context() context,
  ) {
    return this.locationService.statusChange(
      statusChangeInput,
      context.req.user.userId,
    );
  }

  @Query(() => LocationListResponse, { name: 'Location_List' })
  @UserTypes([USER_TYPES.ADMIN, USER_TYPES.USER, USER_TYPES.PUBLIC])
  listLocation(
    @Args('listInputLocation') listInputLocation: ListInputLocation,
    @Info() info: GraphQLResolveInfo,
  ) {
    const projection = getProjection(info.fieldNodes[0]);

    return this.locationService.list(listInputLocation, projection);
  }
}
