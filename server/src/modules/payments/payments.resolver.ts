import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  Info,
} from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { Payment } from 'src/database/models/payments.model';
import { AuthGuard } from 'src/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { UserTypes } from 'src/shared/decorators';
import { PaymentsListResponse } from './entities/payment.entity';
import { ListInputPayments } from './dto/list-payment.input';
import getProjection from 'src/shared/graphql/queryProjection';
import { GraphQLResolveInfo } from 'graphql';

@UseGuards(AuthGuard)
@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UserTypes([USER_TYPES.ADMIN])
  @Mutation(() => Payment)
  createPayment(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
    @Context() context,
  ) {
    const userId = context.req.user.userId;

    return this.paymentsService.create([createPaymentInput], userId);
  }

  @Query(() => PaymentsListResponse)
  @UserTypes([USER_TYPES.ADMIN, USER_TYPES.USER])
  async listPayments(
    @Args('listPaymentInput') listPaymentInput: ListInputPayments,
    @Context() context,
    @Info() info: GraphQLResolveInfo,
  ) {
    const userId = context.req.user.userId;
    const projection = getProjection(info.fieldNodes[0]);
    if (context.req.user.userType === USER_TYPES.USER) {
      listPaymentInput.userIds = [...(listPaymentInput.userIds ?? []), userId];
    }
    return this.paymentsService.listPayments(listPaymentInput, projection);
  }
}
