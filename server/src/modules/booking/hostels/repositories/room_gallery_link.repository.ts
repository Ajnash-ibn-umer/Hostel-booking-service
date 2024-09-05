import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { HostelAmenitiesLinkDocument } from 'src/database/models/join_tables/hostel_x_amenities.model';
import { HostelGalleryLinkDocument } from 'src/database/models/join_tables/hostel_x_gallery.model';
import { RoomGalleryLinkDocument } from 'src/database/models/join_tables/room_x_gallery.model';

@Injectable()
export class RoomGalleryLinksRepository extends EntityRepository<RoomGalleryLinkDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.GALLERY_ROOM_LINKS)
    protected RoomGalleryLinksModel: Model<RoomGalleryLinkDocument>,
  ) {
    super(RoomGalleryLinksModel);
  }
}
