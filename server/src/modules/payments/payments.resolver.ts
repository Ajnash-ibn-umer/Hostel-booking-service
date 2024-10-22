import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { Payment } from 'src/database/models/payments.model';
import { AuthGuard } from 'src/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { UserTypes } from 'src/shared/decorators';

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
}
