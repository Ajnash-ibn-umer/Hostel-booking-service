import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  Info,
} from '@nestjs/graphql';
import { DamageAndSplitService } from './damage_and_split.service';
import { CreateDamageAndSplitInput } from './dto/create-damage_and_split.input';
import { PayUpdateDamageAndSplitInput } from './dto/update-damage_and_split.input';
import { DamageAndSplit } from 'src/database/models/damage-and-split.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { ListInputDamageAndSpit } from './dto/list-damage_and_split.input';
import { DamageAndSplitListResponse } from './entities/damage_and_split.entity';
import { GraphQLResolveInfo } from 'graphql';
import getProjection from 'src/shared/graphql/queryProjection';
import { generalResponse } from 'src/shared/graphql/entities/main.entity';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';

@UseGuards(AuthGuard)
@Resolver(() => DamageAndSplit)
export class DamageAndSplitResolver {
  constructor(private readonly damageAndSplitService: DamageAndSplitService) {}

  @UserTypes([USER_TYPES.ADMIN])
  @Mutation(() => DamageAndSplit, { name: 'DamageAndSplit_Create' })
  createDamageAndSplit(
    @Args('createDamageAndSplitInput')
    createDamageAndSplitInput: CreateDamageAndSplitInput,
    @Context() context,
  ) {
    const userId = context.req.user.userId;

    return this.damageAndSplitService.create(createDamageAndSplitInput, userId);
  }

  @UserTypes([USER_TYPES.ADMIN, USER_TYPES.USER])
  @Query(() => DamageAndSplitListResponse, { name: 'DamageAndSplit_List' })
  async listDamageAndSplit(
    @Args('dto') dto: ListInputDamageAndSpit,
    @Context() context,
    @Info() info: GraphQLResolveInfo,
  ) {
    const userId = context.req.user.userId;
    const projection = getProjection(info.fieldNodes[0]);

    return this.damageAndSplitService.listDamageAndSplit(dto, projection);
  }

  @UserTypes([USER_TYPES.ADMIN])
  @Mutation(() => generalResponse, { name: 'DamageAndSplit_StatusChange' })
  async statusChangeOfDamageAndSplit(
    @Args('statusChangeInput') dto: statusChangeInput,
    @Context() context,
  ) {
    const userId = context.req.user.userId;
    return this.damageAndSplitService.statusChangeOfDamageAndSplit(dto, userId);
  }
}
