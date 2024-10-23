import enumToString from 'src/shared/utils/enumTostring';
import { CreateComplaintInput } from './create-complaint.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { REQUEST_STATUS } from 'src/database/models/complaints.model';

@InputType()
export class UpdateComplaintApprovalStatus {
  @Field(() => ID)
  complaintId: string;

  @Field(() => String, { nullable: true })
  remark: string;

  @Field(() => Int, {
    nullable: true,
    description: enumToString(REQUEST_STATUS),
  })
  requestStatus: number;
}
