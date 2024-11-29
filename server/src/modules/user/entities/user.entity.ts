import enumToString from 'src/shared/utils/enumTostring';
import { ObjectType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { Base } from 'src/shared/graphql/entities/main.entity';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { Booking } from 'src/modules/booking/enitities/booking.entity';
import { Contract } from 'src/database/models/contract.model';
import { ContractInfo } from 'src/modules/booking/enitities/contract.entity';

@ObjectType()
export class User extends PartialType(Base) {
  @Field({ nullable: true })
  userNo: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  email: string;

  // @Field({nullable:true})
  password: string;

  @Field({ nullable: true })
  isActive: boolean;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field({ description: enumToString(USER_TYPES), nullable: true })
  userType: number;

  @Field(() => ID, { nullable: true })
  roleId: string;

  @Field({ nullable: true })
  profileImgUrl: string;

  @Field(() => ID, { nullable: true })
  bookingId: string;

  @Field(() => Booking, { nullable: true })
  booking: Booking;

  @Field(() => Contract, { nullable: true })
  contract: Contract;
}

@ObjectType()
export class ListUsersResponse {
  @Field(() => [User], { nullable: true })
  list: User[];

  @Field({ nullable: true })
  totalCount: number;
}

@ObjectType()
export class LoginResponse {
  @Field({ nullable: true })
  message: string;

  @Field({ nullable: true })
  token: string;

  @Field(() => User, { nullable: true })
  user: User;
}

@ObjectType()
export class PhoneVerifyEntity {
  @Field({ nullable: true })
  message: string;

  @Field(() => ID, { nullable: true })
  userId?: string;

  @Field()
  exists: boolean;
}

@ObjectType()
export class UserTokenResponse {
  @Field({ nullable: true })
  message: string;

  @Field({ nullable: true })
  accessToken: string;

  @Field({ nullable: true })
  refreshToken: string;

  @Field()
  loginStatus: boolean;
}

@ObjectType()
export class Me {
  @Field({ nullable: true })
  message: string;

  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => ContractInfo, { nullable: true })
  contract: ContractInfo;
}
