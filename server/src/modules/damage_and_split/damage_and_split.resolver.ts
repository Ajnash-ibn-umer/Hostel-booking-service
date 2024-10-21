import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { DamageAndSplitService } from './damage_and_split.service';
import { CreateDamageAndSplitInput } from './dto/create-damage_and_split.input';
import { UpdateDamageAndSplitInput } from './dto/update-damage_and_split.input';
import { DamageAndSplit } from 'src/database/models/damage-and-split.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';

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
}
