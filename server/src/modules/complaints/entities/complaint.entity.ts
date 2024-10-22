import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Complaint } from 'src/database/models/complaints.model';

@ObjectType()
export class ComplaintListResponse {
  @Field(() => [Complaint], { nullable: true })
  list: Complaint[];

  @Field(() => Int, { nullable: true })
  totalCount: number;
}
