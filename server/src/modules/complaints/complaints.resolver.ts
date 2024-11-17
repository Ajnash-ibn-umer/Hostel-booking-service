import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  Info,
} from '@nestjs/graphql';
import { ComplaintsService } from './complaints.service';

import { CreateComplaintInput } from './dto/create-complaint.input';
import { UpdateComplaintApprovalStatus } from './dto/update-complaint.input';
import { Complaint } from 'src/database/models/complaints.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { ListInputComplaint } from './dto/list-complaint.input';
import { GraphQLResolveInfo } from 'graphql';
import getProjection from 'src/shared/graphql/queryProjection';
import { ComplaintListResponse } from './entities/complaint.entity';

@UseGuards(AuthGuard)
@Resolver(() => Complaint)
export class ComplaintsResolver {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @UserTypes([USER_TYPES.USER])
  @Mutation(() => Complaint, { name: 'Complaint_Create' })
  createComplaint(
    @Args('createComplaintInput')
    createComplaintInput: CreateComplaintInput,
    @Context() context,
  ) {
    return this.complaintsService.create(
      createComplaintInput,
      context.req.user.userId,
    );
  }

  @UserTypes([USER_TYPES.ADMIN])
  @Mutation(() => Complaint, { name: 'Complaint_UpdateApprovalStatus' })
  async updateApprovalStatus(
    @Args('updateApprovalStatusInput') dto: UpdateComplaintApprovalStatus,
    @Context() context,
  ) {
    const userId = context.req.user.userId;
    return this.complaintsService.updateApprovalStatus(dto, userId);
  }

  @UserTypes([USER_TYPES.USER, USER_TYPES.ADMIN])
  @Query(() => ComplaintListResponse, { name: 'Complaint_List' })
  async listComplaints(
    @Args('dto') dto: ListInputComplaint,
    @Info() info: GraphQLResolveInfo,
    @Context() context,
  ) {
    const userId = context.req.user.userId;
    const projection = getProjection(info.fieldNodes[0]);
    if (context.req.user.userType === USER_TYPES.USER) {
      dto.createdUserIds = [...(dto.createdUserIds ?? []), userId];
    }
    return this.complaintsService.listComplaints(dto, projection);
  }
}
