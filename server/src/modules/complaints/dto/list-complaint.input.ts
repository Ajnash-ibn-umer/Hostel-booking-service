import { Field, ID, InputType, Int, PartialType } from '@nestjs/graphql';
import { REQUEST_STATUS } from 'src/database/models/complaints.model';
import { GenericListInput } from 'src/shared/graphql/entities/main.dto';
import enumToString from 'src/shared/utils/enumTostring';

@InputType()
export class ListInputComplaint extends PartialType(GenericListInput) {
  @Field(() => [ID], { nullable: true })
  complaintIds?: string[];

  @Field(() => [Int], {
    nullable: true,
    description: enumToString(REQUEST_STATUS),
  })
  requestStatus?: number[];

  @Field(() => [ID], { nullable: true })
  roomIds?: string[];

  @Field(() => [ID], { nullable: true })
  propertyIds?: string[];
}
