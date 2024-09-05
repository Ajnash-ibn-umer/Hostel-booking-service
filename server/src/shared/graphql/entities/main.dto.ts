import { Field, InputType, Int } from '@nestjs/graphql';
import enumToString from 'src/shared/utils/enumTostring';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';

@InputType()
export class statusChangeInput {
  @Field((type) => [String], { nullable: false })
  ids: string[];

  @Field((type) => Int, {
    nullable: false,
    description: enumToString(STATUS_NAMES),
  })
  _status: STATUS_NAMES;
}
