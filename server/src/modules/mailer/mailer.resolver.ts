import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MailerService } from './mailer.service';
import { Mailer } from './entities/mailer.entity';
import { CreateMailerInput } from './dto/create-mailer.input';
import { UpdateMailerInput } from './dto/update-mailer.input';
import { generalResponse } from 'src/shared/graphql/entities/main.entity';

@Resolver(() => Mailer)
export class MailerResolver {
  constructor(private readonly mailerService: MailerService) {}

  @Mutation(() => generalResponse)
  createMailer(
    @Args('createMailerInput') createMailerInput: CreateMailerInput,
  ) {
    return this.mailerService.sendPing(createMailerInput);
  }
}
