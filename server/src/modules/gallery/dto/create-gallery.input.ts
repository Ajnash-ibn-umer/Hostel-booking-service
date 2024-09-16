import { InputType, Int, Field } from '@nestjs/graphql';
import { DOC_TYPE } from 'src/database/models/gallery.model';
import enumToString from 'src/shared/utils/enumTostring';

@InputType()
export class CreateGalleryInput {
  @Field(() => String, { description: 'URL of the gallery item' })
  url: string;

  @Field(() => String, {
    description: 'Name of the gallery item',
    nullable: true,
  })
  name: string;

  @Field(() => Int, { description: enumToString(DOC_TYPE) })
  docType: DOC_TYPE;
}
