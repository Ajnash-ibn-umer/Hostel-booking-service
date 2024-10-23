import { CreateGalleryInput } from './create-gallery.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateGalleryInput extends PartialType(CreateGalleryInput) {
  @Field(() => ID)
  _id: string;
}
