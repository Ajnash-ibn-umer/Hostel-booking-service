import { Field, ID, InputType, Int, PartialType } from '@nestjs/graphql';
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

@InputType()
export class RangeInput {
  @Field(() => Number, { nullable: false, description: 'Start date' })
  from: number;

  @Field(() => Number, { nullable: false, description: 'End date' })
  to: number;
}
@InputType()
export class DateRangeInput {
  @Field(() => Date, { nullable: false, description: 'Start date' })
  from: Date;

  @Field(() => Date, { nullable: false, description: 'End date' })
  to: Date;
}

@InputType()
export class GenericListInput {
  @Field(() => Number, {
    nullable: true,
    description: `createdAt = 0,
  status = 1,`,
  })
  sortType: number;

  @Field(() => DateRangeInput, {
    nullable: true,
  })
  dateFilter: DateRangeInput;

  @Field({
    nullable: true,
    description: '1: Ascending order,-1 : Descending order',
  })
  sortOrder: number;

  @Field(() => [Int], {
    description: `DEFAULT=-1,
  ACTIVE = 1,
  DELETE = 2,
  INACTIVE = 0,`,
  })
  statusArray: number[];

  @Field(() => Int, {
    description: 'if limit or skip is -1 : unlimited fetching',
  })
  limit: number;

  @Field(() => Int, { nullable: true })
  skip: number;

  @Field({ nullable: true })
  searchingText: string;
}

@InputType()
export class ContactUsListInput extends PartialType(GenericListInput) {
  @Field(() => [ID], {
    nullable: true,
  })
  contactUsIds: string[];
}

@InputType()
export class ContactUsInput {
  @Field(() => String, { nullable: false, description: 'Name of the contact' })
  name: string;

  @Field(() => String, { nullable: true, description: 'Email of the contact' })
  email: string;

  @Field(() => String, {
    nullable: true,
    description: 'Message from the contact',
  })
  message: string;

  @Field(() => String, {
    nullable: true,
    description: 'Phone number of the contact',
  })
  phone?: string;
}
