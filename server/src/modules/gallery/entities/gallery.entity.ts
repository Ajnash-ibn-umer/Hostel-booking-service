import { ObjectType, Field, Int, PartialType } from '@nestjs/graphql';
import { DOC_TYPE } from 'src/database/models/gallery.model';
import { Base } from 'src/shared/graphql/entities/main.entity';
import enumToString from 'src/shared/utils/enumTostring';

@ObjectType()
export class Gallery extends PartialType(Base) {
  @Field(() => String, {
    description: 'Unique identifier for the gallery item',
  })
  uid: string;

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

@ObjectType()
export class ListGalleryResponse {
  @Field(() => [Gallery], { description: 'List of gallery items' })
  list: Gallery[];

  @Field(() => Int, { description: 'Total number of gallery items' })
  total: number;
}
