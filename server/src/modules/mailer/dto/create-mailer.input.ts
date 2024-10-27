import { InputType, Int, Field } from '@nestjs/graphql';
export enum EMAIL_TEMPLATES {
  WELCOME = 'welcome',
  BOOKING_APPROVAL = 'booking-approval',
  CHECKIN_CONFIRMED = 'checkin-confirmed',
  BOOKING_SUCCESSFULL = 'booking-successfull',
  GENERIC = 'generic',
}
@InputType()
export class CreateMailerInput {
  @Field(() => String, { description: 'Subject of the email' })
  subject: string;

  @Field(() => String, { description: 'Content of the email' })
  content: string;

  @Field(() => String, { description: 'Recipient email address' })
  email: string;
}

@InputType()
export class MailParams {
  subject: string;

  template: EMAIL_TEMPLATES;

  context: Record<string, string>;

  to: string;
}
