import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateComplaintInput } from './dto/create-complaint.input';
import { UpdateComplaintApprovalStatus } from './dto/update-complaint.input';
import { ComplaintRepository } from './repository/complaints.repository';
import { ComplaintStatusHistoryRepository } from './repository/complaints-status-history.repository';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import { GraphQLError } from 'graphql';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ComplaintsGalleryRepository } from './repository/complaints-gallery-link.repository';
import { GalleryService } from '../gallery/gallery.service';
import { ComplaintGalleryLink } from 'src/database/models/join_tables/complaint_x_gallery.model';
import {
  Complaint,
  REQUEST_STATUS,
} from 'src/database/models/complaints.model';
import {
  MatchList,
  Paginate,
  Search,
} from 'src/shared/utils/mongodb/filtration.util';
import { responseFormat } from 'src/shared/graphql/queryProjection';
import { ListInputComplaint } from './dto/list-complaint.input';
import { ComplaintListResponse } from './entities/complaint.entity';
import { MODEL_NAMES } from 'src/database/modelNames';
import { Lookup } from 'src/shared/utils/mongodb/lookupGenerator';
import { statusChangeInput } from 'src/shared/graphql/entities/main.dto';
import { generalResponse } from 'src/shared/graphql/entities/main.entity';
@Injectable()
export class ComplaintsService {
  constructor(
    private complaintsRepository: ComplaintRepository,
    private complaintsStatusHistoryRepository: ComplaintStatusHistoryRepository,
    private complaintsGalleryLinkRepository: ComplaintsGalleryRepository,
    private galleryService: GalleryService,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}

  async create(dto: CreateComplaintInput, userId: string) {
    const startTime = new Date();
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const galleryLinks: ComplaintGalleryLink[] = [];

      const complaintId = new mongoose.Types.ObjectId();
      if (dto.files && dto.files.length > 0) {
        const galleries = await this.galleryService.createMulti(
          { galleryData: dto.files },
          userId,
          session,
        );
        for (let gallery of galleries) {
          galleryLinks.push({
            galleryId: gallery._id,
            complaintId: complaintId,
            url: gallery.url,
            createdAt: startTime,
            createdUserId: userId,
            status: STATUS_NAMES.ACTIVE,
          });
        }
      }
      const newComplaint = await this.complaintsRepository.create(
        {
          ...dto,
          userId: userId,
          _id: complaintId,
          title: dto.title,
          description: dto.description,
          createdUserId: userId,
          createdAt: startTime,
          status: STATUS_NAMES.ACTIVE,
        },
        session,
      );

      await this.complaintsStatusHistoryRepository.create(
        {
          complaintReportId: newComplaint.id,
          createdUserId: userId,
          requestStatus: REQUEST_STATUS.PENDING,
          createdAt: startTime,
          status: STATUS_NAMES.ACTIVE,
          remark: `New Complaint created by ${userId}`,
        },
        session,
      );

      await this.complaintsGalleryLinkRepository.insertMany(
        galleryLinks as any,
        session,
      );
      await session.commitTransaction();
      return newComplaint;
    } catch (error) {
      await session.abortTransaction();
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    } finally {
      session.endSession();
    }
  }

  async updateApprovalStatus(
    dto: UpdateComplaintApprovalStatus,
    userId: string,
  ): Promise<Complaint> {
    const startTime = new Date();
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const complaint = await this.complaintsRepository.findOneAndUpdate(
        {
          _id: dto.complaintId,
          status: STATUS_NAMES.ACTIVE,
        },
        {
          updatedAt: startTime,
          updatedUserId: userId,
          requestStatus: dto.requestStatus,
          remark: dto.remark,
        },
        session,
      );
      if (!complaint) {
        throw new Error('Complaint not found');
      }

      await this.complaintsStatusHistoryRepository.create(
        {
          complaintReportId: complaint.id,
          createdUserId: userId,
          requestStatus: dto.requestStatus,
          createdAt: startTime,
          status: STATUS_NAMES.ACTIVE,
          remark: dto.remark || `Status updated by ${userId}`,
        },
        session,
      );

      await session.commitTransaction();
      return complaint;
    } catch (error) {
      await session.abortTransaction();
      throw new GraphQLError(error.message, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    } finally {
      session.endSession();
    }
  }

  async statusChange(
    dto: statusChangeInput,
    userId: string,
  ): Promise<generalResponse> {
    const startTime = new Date();
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      var result = await this.complaintsRepository.updateMany(
        {
          _id: { $in: dto.ids },
        },
        {
          $set: {
            updatedUserId: userId,
            updatedAt: startTime,
            status: dto._status,
          },
        },
      );
      await session.commitTransaction();
      return { message: 'Status updated successfully' };
    } catch (error) {
      await session.abortTransaction();
      throw new GraphQLError(error.message, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    } finally {
      session.endSession();
    }
  }
  async listComplaints(
    dto: ListInputComplaint,
    projection: Record<string, any>,
  ): Promise<ComplaintListResponse> {
    const pipeline: any[] = [];

    if (dto.searchingText && dto.searchingText !== '') {
      pipeline.push(Search(['description', 'title'], dto.searchingText));
    }
    pipeline.push(
      ...MatchList([
        {
          match: { status: dto.statusArray },
          _type_: 'number',
          required: true,
        },
        {
          match: { _id: dto.complaintIds },
          _type_: 'objectId',
          required: false,
        },
        {
          match: { propertyId: dto.propertyIds },
          _type_: 'objectId',
          required: false,
        },
        {
          match: { roomId: dto.roomIds },
          _type_: 'objectId',
          required: false,
        },
        {
          match: { requestStatus: dto.requestStatus },
          _type_: 'number',
          required: false,
        },
      ]),
    );
    switch (dto.sortType) {
      case 0:
        pipeline.push({
          $sort: {
            createdAt: dto.sortOrder ?? 1,
          },
        });
        break;
      case 1:
        pipeline.push({
          $sort: {
            requestStatus: dto.sortOrder ?? 1,
          },
        });
        break;
      default:
        pipeline.push({
          $sort: {
            _id: dto.sortOrder ?? 1,
          },
        });
        break;
    }

    pipeline.push(...Paginate(dto.skip, dto.limit));
    projection && pipeline.push(responseFormat(projection['list']));
    if (projection['list']['createdUser']) {
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.USER,
          params: { id: '$createdUserId' },
          conditions: { $_id: '$$id' },
          responseName: 'createdUser',
        }),
      );
    }

    if (projection['list']['galleries']) {
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.COMPLAINTS_GALLERY_LINKS,
          params: { id: '$_id' },
          conditions: { $complaintId: '$$id' },
          responseName: 'galleries',
          isNeedUnwind: false,
          innerPipeline: [
            ...Lookup({
              modelName: MODEL_NAMES.GALLERY,
              params: { id: '$galleryId' },
              project: responseFormat(projection['list']['galleries']),
              conditions: { $_id: '$$id' },
              responseName: 'galleries',
            }),
          ],
        }),
        {
          $addFields: {
            galleries: '$galleries.galleries',
          },
        },
      );
    }

    if (projection['list']['property']) {
      console.log('in property');
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.HOSTEL,
          params: { id: '$propertyId' },
          project: responseFormat(projection['list']['property']),
          conditions: { $_id: '$$id' },
          responseName: 'property',
        }),
      );
    }

    if (projection['list']['room']) {
      console.log('in room');
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.ROOM,
          params: { id: '$roomId' },
          project: responseFormat(projection['list']['room']),
          conditions: { $_id: '$$id' },
          responseName: 'room',
        }),
      );
    }

    if (projection['list']['user']) {
      pipeline.push(
        ...Lookup({
          modelName: MODEL_NAMES.USER,
          params: { id: '$userId' },
          project: responseFormat(projection['list']['user']),
          conditions: { $_id: '$$id' },
          responseName: 'user',
        }),
      );
    }
    // Execute the aggregation pipeline
    const list = (await this.complaintsRepository.aggregate(
      pipeline,
    )) as Complaint[];
    const totalCount = projection['totalCount']
      ? await this.complaintsRepository.totalCount(pipeline)
      : 0;

    return {
      list,
      totalCount: totalCount,
    };
  }
}
