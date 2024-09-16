import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryResolver } from './gallery.resolver';
import { GalleryRepository } from './repository/gallery.respository';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelDefinitions } from 'src/database/modelDefinitions';

@Module({
  providers: [GalleryResolver, GalleryService, GalleryRepository],
  imports: [MongooseModule.forFeature([ModelDefinitions.galleryModel])],
})
export class GalleryModule {}
