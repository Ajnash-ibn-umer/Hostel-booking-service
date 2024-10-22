import { Module } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { ComplaintsResolver } from './complaints.resolver';
import { ComplaintStatusHistoryRepository } from './repository/complaints-status-history.repository';
import { ComplaintRepository } from './repository/complaints.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelDefinitions } from 'src/database/modelDefinitions';
import { ComplaintsGalleryRepository } from './repository/complaints-gallery-link.repository';
import { GalleryService } from '../gallery/gallery.service';
import { GalleryRepository } from '../gallery/repository/gallery.respository';
import { CounterRepository } from '../counter/repository/counter.repository';

@Module({
  providers: [
    ComplaintsResolver,
    ComplaintsService,
    ComplaintStatusHistoryRepository,
    ComplaintRepository,
    ComplaintsGalleryRepository,
    GalleryService,
    GalleryRepository,
    CounterRepository,
  ],
  imports: [
    MongooseModule.forFeature([
      ModelDefinitions.complaintsModel,
      ModelDefinitions.complaintsStatusHistoryModel,
      ModelDefinitions.complaintsGalleryLinkModel,
      ModelDefinitions.galleryModel,
      ModelDefinitions.counterModel,
    ]),
  ],
})
export class ComplaintsModule {}
