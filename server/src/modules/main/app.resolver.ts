import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ContactUsInput,
  ContactUsListInput,
} from 'src/shared/graphql/entities/main.dto';
import {
  ContactUs,
  ContactUsList,
  generalResponse,
  infoResponse,
} from 'src/shared/graphql/entities/main.entity';
import { AppService } from './app.service';
import { execSync } from 'child_process';
import { GraphQLResolveInfo } from 'graphql';
import getProjection from 'src/shared/graphql/queryProjection';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';
@UseGuards(AuthGuard)
@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}
  @Mutation(() => generalResponse)
  async init() {
    return { message: 'Hao' };
  }

  @Query(() => infoResponse)
  async info(): Promise<infoResponse> {
    const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();
    const commitDate = execSync('git log -1 --format=%cd').toString().trim();
    return {
      date: commitDate,
      version: '1.4',
      description: commitMessage,
    };
  }

  @UserTypes([USER_TYPES.ADMIN, USER_TYPES.USER, USER_TYPES.PUBLIC])
  @Mutation(() => ContactUs, { name: 'ContactUs_Create' })
  async contactUsCreate(@Args('dto') dto: ContactUsInput): Promise<ContactUs> {
    const contactUs = await this.appService.contactUsCreate(dto);
    return contactUs;
  }

  @Query(() => ContactUsList, { name: 'ContactUs_List' })
  @UserTypes([USER_TYPES.ADMIN])
  async listContactUs(
    @Info() info: GraphQLResolveInfo,
    @Args('dto') dto: ContactUsListInput,
  ): Promise<ContactUsList> {
    const projection = getProjection(info.fieldNodes[0]);

    return await this.appService.listContactUs(dto, projection);
  }
}
