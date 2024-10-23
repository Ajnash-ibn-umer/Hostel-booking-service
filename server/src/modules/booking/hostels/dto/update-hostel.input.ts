import {
  CreateBedInput,
  CreateHostelInput,
  CreateRoomInput,
} from './create-hostel.input';
import {
  InputType,
  Field,
  Int,
  PartialType,
  ID,
  OmitType,
} from '@nestjs/graphql';

@InputType()
export class UpdateBedInput extends PartialType(CreateBedInput) {
  @Field(() => ID)
  _id: string;
}

@InputType()
export class UpdateRoomInput extends PartialType(
  OmitType(CreateRoomInput, ['beds']),
) {
  @Field(() => ID)
  _id: string;

  @Field(() => [UpdateBedInput], { nullable: true })
  beds: UpdateBedInput[];
}

@InputType()
export class UpdateHostelInput extends PartialType(
  OmitType(CreateHostelInput, ['rooms']),
) {
  @Field(() => ID)
  _id: string;

  @Field(() => [ID], { nullable: true })
  deletedRoomIds: string[];

  @Field(() => [ID], { nullable: true })
  deletedBedIds: string[];

  @Field(() => [UpdateRoomInput], { nullable: true })
  rooms?: UpdateRoomInput[];
}
