import { HttpStatus, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { ContactUsRepository } from 'src/repositories/contact-us.repository';
import {
  ContactUsInput,
  ContactUsListInput,
} from 'src/shared/graphql/entities/main.dto';
import {
  ContactUs,
  ContactUsList,
} from 'src/shared/graphql/entities/main.entity';
import { Paginate, Search } from 'src/shared/utils/mongodb/filtration.util';
import mongoose from 'mongoose';
import { responseFormat } from 'src/shared/graphql/queryProjection';

@Injectable()
export class AppService {
  constructor(private readonly contactUsRepostitory: ContactUsRepository) {}
  getHello(): string {
    return 'Hello World!';
  }

  async contactUsCreate(dto: ContactUsInput) {
    try {
      const contactUs = await this.contactUsRepostitory.create({
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        message: dto.message,
        createdAt: Date.now(),
      });
      if (!contactUs) {
        throw `contactUs not created`;
      }
      return contactUs;
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async listContactUs(
    dto: ContactUsListInput,
    projection: Record<string, any>,
  ): Promise<ContactUsList> {
    const pipeline: any[] = [];

    if (dto.searchingText && dto.searchingText !== '') {
      pipeline.push(
        Search(['name', 'email', 'name', 'phone'], dto.searchingText),
      );
    }

    // Add match conditions based on dto
    if (dto.contactUsIds && dto.contactUsIds.length > 0) {
      pipeline.push({
        $match: {
          _id: {
            $in: dto.contactUsIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      });
    }
    pipeline.push({
      $match: {
        status: {
          $in: dto.statusArray,
        },
      },
    });
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
            name: dto.sortOrder ?? 1,
          },
        });
        break;
      case 2:
        pipeline.push({
          $sort: {
            status: dto.sortOrder ?? 1,
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

    // Execute the aggregation pipeline
    const list = (await this.contactUsRepostitory.aggregate(
      pipeline,
    )) as ContactUs[];
    console.log(list);
    const totalCount = await this.contactUsRepostitory.totalCount(pipeline);
    return {
      list,
      totalCount: totalCount,
    };
  }
}
