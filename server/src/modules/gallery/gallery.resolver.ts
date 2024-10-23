import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  Info,
} from '@nestjs/graphql';
import { GalleryService } from './gallery.service';
import { Gallery } from './entities/gallery.entity';
import {
  CreateGalleryInput,
  CreateGalleryMultipleInput,
} from './dto/create-gallery.input';
import { UpdateGalleryInput } from './dto/update-gallery.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { UserTypes } from 'src/shared/decorators';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
import { ListHostelsResponse } from '../booking/hostels/entities/hostel.entity';
import { GraphQLResolveInfo } from 'graphql';
import { ListInputGallery } from './dto/list-gallery.input';
import getProjection from 'src/shared/graphql/queryProjection';
import { generalResponse } from 'src/shared/graphql/entities/main.entity';

@UseGuards(AuthGuard)
@Resolver(() => Gallery)
export class GalleryResolver {
  constructor(private readonly galleryService: GalleryService) {}

  @UserTypes([USER_TYPES.ADMIN, USER_TYPES.USER])
  @Mutation(() => Gallery, { name: 'Gallery_Create' })
  createGallery(
    @Args('createGalleryInput') createGalleryInput: CreateGalleryInput,
    @Context() context,
  ) {
    return this.galleryService.create(
      createGalleryInput,
      context.req.user.userId,
    );
  }

  @UserTypes([USER_TYPES.ADMIN, USER_TYPES.USER])
  @Mutation(() => [Gallery], { name: 'Gallery_Multi_Create' })
  createMultiGallery(
    @Args('createGalleryInput')
    createGalleryInput: CreateGalleryMultipleInput,
    @Context() context,
  ) {
    return this.galleryService.createMulti(
      createGalleryInput,
      context.req.user.userId,
    );
  }

  @UserTypes([USER_TYPES.ADMIN, USER_TYPES.USER])
  @Mutation(() => Gallery, { name: 'Gallery_Update' })
  updateGallery(
    @Args('updateGalleryInput') updateGalleryInput: UpdateGalleryInput,
    @Context() context,
  ) {
    return this.galleryService.update(
      updateGalleryInput,
      context.req.user.userId,
    );
  }

  @UserTypes([USER_TYPES.ADMIN, USER_TYPES.USER])
  @Mutation(() => generalResponse, { name: 'Gallery_StatusChange' })
  statusChange(
    @Args('statusChangeInput') statusChangeInput: statusChangeInput,
    @Context() context,
  ) {
    return this.galleryService.statusChange(
      statusChangeInput,
      context.req.user.userId,
    );
  }

  @Query(() => ListHostelsResponse, { name: 'Gallery_List' })
  listGalleries(
    @Args('listInputGallery') listInputGallery: ListInputGallery,
    @Info() info: GraphQLResolveInfo,
  ) {
    const projection = getProjection(info.fieldNodes[0]);

    return this.galleryService.list(listInputGallery, projection);
  }
}
