import { ObjectType, Field, Int, PartialType } from '@nestjs/graphql';
import { User } from 'src/modules/user/entities/user.entity';
import { Base } from 'src/shared/graphql/entities/main.entity';

@ObjectType()
export class RoomType extends PartialType(Base) {
  @Field({ description: 'Name of the room type', nullable: true })
  name?: string;

  @Field({ description: 'Description of the room type', nullable: true })
  description?: string;

  @Field({ description: 'Number of beds in the room', nullable: true })
  bedCount?: number;

  @Field({ description: 'Security deposit amount', nullable: true })
  securityDeposit?: number;

  @Field({ description: 'Upper limit of monthly rent', nullable: true })
  rentMonthlyUpper?: number;

  @Field({ description: 'Lower limit of monthly rent', nullable: true })
  rentMonthlyLower?: number;

  @Field({ description: 'Lower limit of daily rent', nullable: true })
  rentDailyLower?: number;

  @Field({ description: 'Upper limit of daily rent', nullable: true })
  rentDailyUpper?: number;

  @Field(() => User, {
    nullable: true,
  })
  createdUser: User;
}

@ObjectType()
export class RoomTypeListResponse {
  @Field(() => [RoomType], { nullable: true })
  list: RoomType[];

  @Field(() => Int, { nullable: true })
  totalCount: number;
}
