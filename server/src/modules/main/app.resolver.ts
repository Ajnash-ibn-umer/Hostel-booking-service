import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContactUsInput } from 'src/shared/graphql/entities/main.dto';
import {
  ContactUs,
  infoResponse,
} from 'src/shared/graphql/entities/main.entity';
import { AppService } from './app.service';
import { execSync } from 'child_process';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}
  // @Mutation(()=>generalResponse)
  // async init(){
  //     return this.appService.projectInit()
  // }

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

  @Mutation(() => ContactUs, { name: 'ContactUs_Create' })
  async contactUsCreate(@Args('dto') dto: ContactUsInput): Promise<ContactUs> {
    const contactUs = await this.appService.contactUsCreate(dto);
    return contactUs;
  }
}
