import { ObjectType, Field, Int, PartialType } from '@nestjs/graphql';
import { User } from 'src/modules/user/entities/user.entity';
import { Base } from 'src/shared/graphql/entities/main.entity';

@ObjectType()
export class RoomType extends PartialType(Base) {
  @Field({ description: 'Name of the room type' })
  name: string;

  @Field({ description: 'Description of the room type' })
  description: string;

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
