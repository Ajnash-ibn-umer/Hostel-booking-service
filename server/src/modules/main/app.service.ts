import { HttpStatus, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { ContactUsRepository } from 'src/repositories/contact-us.repository';
import { ContactUsInput } from 'src/shared/graphql/entities/main.dto';

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
}
