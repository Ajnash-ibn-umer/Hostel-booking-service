import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginAdminInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class OtpVerifyTokenInput {
  @Field()
  token: string;

  @Field()
  userId: string;
}
