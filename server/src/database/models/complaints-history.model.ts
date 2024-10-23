import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from './base.model';
import { MODEL_NAMES } from '../modelNames';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Complaint, REQUEST_STATUS } from './complaints.model';

export type ComplaintReportStatusHistoryDocument =
  HydratedDocument<ComplaintReportStatusHistory>;

@ObjectType()
@Schema()
export class ComplaintReportStatusHistory extends Base {
  @Field(() => ID, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: MODEL_NAMES.COMPLAINTS })
  complaintReportId: string;

  @Field(() => Int, { nullable: true })
  @Prop({ type: Number, required: false, default: 1, enum: REQUEST_STATUS })
  requestStatus: number;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  remark: string;

  @Field(() => Complaint, { nullable: true })
  complaint: Complaint;
}

export const ComplaintReportStatusHistorySchema = SchemaFactory.createForClass(
  ComplaintReportStatusHistory,
);

ComplaintReportStatusHistorySchema.index({
  complaintReportId: 1,
  bookingId: 1,
});
