import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { ComplaintGalleryLinkDocument } from 'src/database/models/join_tables/complaint_x_gallery.model';

@Injectable()
export class ComplaintsGalleryRepository extends EntityRepository<ComplaintGalleryLinkDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.COMPLAINTS_GALLERY_LINKS)
    protected complaintsGalleryModel: Model<ComplaintGalleryLinkDocument>,
  ) {
    super(complaintsGalleryModel);
  }
}
