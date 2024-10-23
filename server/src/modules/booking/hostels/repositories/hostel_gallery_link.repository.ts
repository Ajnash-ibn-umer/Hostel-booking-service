import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { HostelAmenitiesLinkDocument } from 'src/database/models/join_tables/hostel_x_amenities.model';
import { HostelGalleryLinkDocument } from 'src/database/models/join_tables/hostel_x_gallery.model';

@Injectable()
export class HostelGalleryLinksRepository extends EntityRepository<HostelGalleryLinkDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.GALLERY_HOSTEL_LINKS)
    protected HostelGalleryLinksModel: Model<HostelGalleryLinkDocument>,
  ) {
    super(HostelGalleryLinksModel);
  }
}
