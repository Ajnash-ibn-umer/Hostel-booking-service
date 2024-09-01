import { MODEL_NAMES } from './modelNames';
import { CounterSchema } from './models/counter.model';
import { GallerySchema } from './models/gallery.model';
import { HostelSchema } from './models/hostel.model';
import { HostelGalleryLinkSchema } from './models/join_tables/hostel_x_gallery.model';
import { UserSchema } from './models/user.model';

export const ModelDefinitions = {
  userModel: {
    name: MODEL_NAMES.USER,
    schema: UserSchema,
  },
  counterModel: {
    name: MODEL_NAMES.COUNTER,
    schema: CounterSchema,
  },
  hostelModel: {
    name: MODEL_NAMES.HOSTEL,
    schema: HostelSchema,
  },
  galleryModel: {
    name: MODEL_NAMES.GALLERY,
    schema: GallerySchema,
  },
  galleryHostelLinksModel: {
    name: MODEL_NAMES.GALLERY_HOSTEL_LINKS,
    schema: HostelGalleryLinkSchema,
  },
};
