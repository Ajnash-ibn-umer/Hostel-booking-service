import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { CreateGalleryInput } from 'src/modules/gallery/dto/create-gallery.input';

@InputType()
export class CreateComplaintInput {
  @Field({ description: 'Title of the complaint' })
  title: string;

  @Field(() => ID, {
    description: 'ID of the room associated with the complaint',
  })
  roomId: string;

  @Field(() => ID, {
    description: 'ID of the property associated with the complaint',
  })
  propertyId: string;

  @Field({ description: 'Description of the complaint' })
  description: string;

  @Field(() => [CreateGalleryInput], {
    description: 'File name and URL of the complaint',
  })
  files: CreateGalleryInput[];
}
