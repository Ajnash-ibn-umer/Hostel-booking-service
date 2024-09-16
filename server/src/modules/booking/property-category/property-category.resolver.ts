import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  Info,
} from '@nestjs/graphql';
import { PropertyCategoryService } from './property-category.service';
import {
  ListCategoryResponse,
  PropertyCategory,
} from './entities/property-category.entity';
import { CreatePropertyCategoryInput } from './dto/create-property-category.input';
import { UpdatePropertyCategoryInput } from './dto/update-property-category.input';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ListInputCategory } from './dto/list-property-category.input';
import { GraphQLResolveInfo } from 'graphql';
import getProjection from 'src/shared/graphql/queryProjection';

@UseGuards(AuthGuard)
@Resolver(() => PropertyCategory)
export class PropertyCategoryResolver {
  constructor(
    private readonly propertyCategoryService: PropertyCategoryService,
  ) {}

  @Mutation(() => PropertyCategory, { name: 'PropertyCategory_Create' })
  @UserTypes([USER_TYPES.ADMIN])
  createPropertyCategory(
    @Args('createPropertyCategoryInput')
    createPropertyCategoryInput: CreatePropertyCategoryInput,
    @Context() context,
  ) {
    return this.propertyCategoryService.create(
      createPropertyCategoryInput,
      context.req.user.userId,
    );
  }

  @Mutation(() => PropertyCategory, { name: 'PropertyCategory_Update' })
  @UserTypes([USER_TYPES.ADMIN])
  updatePropertyCategory(
    @Args('updatePropertyCategoryInput')
    updatePropertyCategoryInput: UpdatePropertyCategoryInput,
    @Context() context,
  ) {
    return this.propertyCategoryService.update(
      updatePropertyCategoryInput,
      context.req.user.userId,
    );
  }

  @Mutation(() => String, { name: 'PropertyCategory_StatusChange' })
  @UserTypes([USER_TYPES.ADMIN])
  statusChangePropertyCategory(
    @Args('statusChangeInput') statusChangeInput: statusChangeInput,
    @Context() context,
  ) {
    return this.propertyCategoryService.statusChange(
      statusChangeInput,
      context.req.user.userId,
    );
  }

  @Query(() => ListCategoryResponse, { name: 'PropertyCategory_List' })
  @UserTypes([USER_TYPES.ADMIN])
  async listPropertyCategories(
    @Args('listInput') listInput: ListInputCategory,
    @Context() context,
    @Info() info: GraphQLResolveInfo,
  ): Promise<ListCategoryResponse> {
    const projection = getProjection(info.fieldNodes[0]);

    return this.propertyCategoryService.listPropertyCategories(
      listInput,
      projection,
    );
  }
}
