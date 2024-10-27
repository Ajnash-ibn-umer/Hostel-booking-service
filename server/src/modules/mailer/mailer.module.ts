import { Global, Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerResolver } from './mailer.resolver';

@Global()
@Module({
  providers: [MailerResolver, MailerService],
  exports: [MailerService],
})
export class MailerModule {}
