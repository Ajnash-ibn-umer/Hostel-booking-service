import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMailerInput, MailParams } from './dto/create-mailer.input';
import { UpdateMailerInput } from './dto/update-mailer.input';
import { MailerService as NodeMailerService } from '@nestjs-modules/mailer';
import { GraphQLError } from 'graphql';
import { dot } from 'node:test/reporters';
@Injectable()
export class MailerService {
  constructor(private readonly nodeMailerService: NodeMailerService) {}
  sendPing(dto: CreateMailerInput) {
    try {
      this.nodeMailerService.sendMail({
        to: dto.email,
        from: process.env.MAIL_USER,
        subject: dto.subject,
        template: 'welcome',
        context: {
          firstName: 'user',
          username: 'user 1',
        },
      });
      return { message: 'Email sent successfully' };
    } catch (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
  send(dto: MailParams) {
    try {
      this.nodeMailerService.sendMail({
        to: dto.to,
        from: process.env.MAIL_USER,
        subject: dto.subject,
        template: dto.template,
        context: dto.context,
      });
      return { message: 'Email sent successfully' };
    } catch (error) {
      console.error(error);
    }
  }
}
