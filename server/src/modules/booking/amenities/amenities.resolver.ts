import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { AmenitiesService } from './amenities.service';
import { Amenity } from './entities/amenity.entity';
import { CreateAmenityInput } from './dto/create-amenity.input';
import { UpdateAmenityInput } from './dto/update-amenity.input';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Resolver(() => Amenity)
export class AmenitiesResolver {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Mutation(() => Amenity, { name: 'Amenity_Create' })
  @UserTypes([USER_TYPES.ADMIN])
  createAmenity(
    @Args('createAmenityInput') createAmenityInput: CreateAmenityInput,
    @Context() context,
  ) {
    return this.amenitiesService.create(
      createAmenityInput,
      context.req.user.userId,
    );
  }

  @Mutation(() => Amenity, { name: 'Amenity_Update' })
  @UserTypes([USER_TYPES.ADMIN])
  updateAmenity(
    @Args('updateAmenityInput') updateAmenityInput: UpdateAmenityInput,
    @Context() context,
  ) {
    return this.amenitiesService.update(
      updateAmenityInput,
      context.req.user.userId,
    );
  }

  @Mutation(() => String, { name: 'Amenity_StatusChange' })
  @UserTypes([USER_TYPES.ADMIN])
  statusChangeAmenity(
    @Args('statusChangeInput') statusChangeInput: statusChangeInput,
    @Context() context,
  ) {
    return this.amenitiesService.statusChange(
      statusChangeInput,
      context.req.user.userId,
    );
  }
}
