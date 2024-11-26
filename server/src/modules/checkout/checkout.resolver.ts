import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  Info,
} from '@nestjs/graphql';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutInput } from './dto/create-checkout.input';
import { CheckoutRequest } from 'src/database/models/checkout-request.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { generalResponse } from 'src/shared/graphql/entities/main.entity';
import {
  ForcedCheckoutInput,
  UpdateCHeqoutRequestApprovalStatus,
} from './dto/update-checkout.input';
import { CheckoutRequestListResponse } from './entities/checkout.entity';
import { ListInputCheckoutRequest } from './dto/list-checkout-request.dto';
import { GraphQLResolveInfo } from 'graphql';
import getProjection from 'src/shared/graphql/queryProjection';

@UseGuards(AuthGuard)
@Resolver(() => CheckoutRequest)
export class CheckoutResolver {
  constructor(private readonly checkoutService: CheckoutService) {}

  @UserTypes([USER_TYPES.USER, USER_TYPES.ADMIN])
  @Mutation(() => CheckoutRequest, { name: 'CHECKOUT_REQUEST_CREATE' })
  createCheckout(
    @Args('createCheckoutInput') createCheckoutInput: CreateCheckoutInput,
    @Context() context,
  ) {
    const userId = context.req.user.userId;

    return this.checkoutService.create(createCheckoutInput, userId);
  }

  @UserTypes([USER_TYPES.USER, USER_TYPES.ADMIN])
  @Mutation(() => generalResponse, { name: 'CHECKOUT_REQUEST_UPDATE_STATUS' })
  updateApprovalStatus(
    @Args('updateCheckoutInput')
    updateCheckoutInput: UpdateCHeqoutRequestApprovalStatus,
    @Context() context,
  ) {
    const userId = context.req.user.userId;

    return this.checkoutService.updateApprovalStatus(
      updateCheckoutInput,
      userId,
    );
  }

  @UserTypes([USER_TYPES.USER, USER_TYPES.ADMIN])
  @Mutation(() => generalResponse, { name: 'CHECKOUT_REQUEST_CHECKOUT' })
  forcedCheckout(
    @Args('forcedCheckoutInput')
    dto: ForcedCheckoutInput,
    @Context() context,
  ) {
    const userId = context.req.user.userId;

    return this.checkoutService.checkout(dto, userId);
  }

  @UserTypes([USER_TYPES.USER, USER_TYPES.ADMIN])
  @Query(() => CheckoutRequestListResponse, { name: 'CHECKOUT_REQUEST_LIST' })
  listCheckoutRequests(
    @Args('listCheckoutRequestInput')
    dto: ListInputCheckoutRequest,
    @Info() info: GraphQLResolveInfo,
    @Context() context,
  ) {
    const userId = context.req.user.userId;
    const projection = getProjection(info.fieldNodes[0]);
    if (context.req.user.userType === USER_TYPES.USER) {
      dto.guestIds = [...(dto.guestIds ?? []), userId];
    }
    return this.checkoutService.listCheckoutRequests(dto, projection);
  }
}
