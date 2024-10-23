import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/config/entity.repository';
import { MODEL_NAMES } from 'src/database/modelNames';
import { GalleryDocument } from 'src/database/models/gallery.model';

@Injectable()
export class GalleryRepository extends EntityRepository<GalleryDocument> {
  constructor(
    @InjectModel(MODEL_NAMES.GALLERY)
    protected GalleryModel: Model<GalleryDocument>,
  ) {
    super(GalleryModel);
  }
}
