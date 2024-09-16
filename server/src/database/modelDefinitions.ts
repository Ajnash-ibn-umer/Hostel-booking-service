import { MODEL_NAMES } from './modelNames';
import { AmenitySchema } from './models/amenity.model';
import { BedSchema } from './models/bed.model';
import { CategorySchema } from './models/category.model';
import { CounterSchema } from './models/counter.model';
import { GallerySchema } from './models/gallery.model';
import { HostelSchema } from './models/hostel.model';
import { HostelAmenitiesLinkSchema } from './models/join_tables/hostel_x_amenities.model';
import { HostelGalleryLinkSchema } from './models/join_tables/hostel_x_gallery.model';
import { RoomAmenitiesLinkSchema } from './models/join_tables/room_x_amenities.model';
import { RoomGalleryLinkSchema } from './models/join_tables/room_x_gallery.model';
import { LocationSchema } from './models/location.model';
import { RoomSchema } from './models/room.model';
import { RoomTypeSchema } from './models/roomTytpe.model';
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
  galleryRoomLinksModel: {
    name: MODEL_NAMES.GALLERY_ROOM_LINKS,
    schema: RoomGalleryLinkSchema,
  },
  bedModel: {
    name: MODEL_NAMES.BED,
    schema: BedSchema,
  },
  roomModel: {
    name: MODEL_NAMES.ROOM,
    schema: RoomSchema,
  },
  amenitiesModel: {
    name: MODEL_NAMES.AMENITIES,
    schema: AmenitySchema,
  },
  hostelAmenitiesLinksModel: {
    name: MODEL_NAMES.HOSTEL_X_AMENITIES,
    schema: HostelAmenitiesLinkSchema,
  },
  roomAmenitiesLinksModel: {
    name: MODEL_NAMES.ROOM_X_AMENITIES,
    schema: RoomAmenitiesLinkSchema,
  },
  locationModel: {
    name: MODEL_NAMES.LOCATION,
    schema: LocationSchema,
  },
  categoryModel: {
    name: MODEL_NAMES.CATEGORY,
    schema: CategorySchema,
  },
  roomTypeModel: {
    name: MODEL_NAMES.ROOM_TYPES,
    schema: RoomTypeSchema,
  },
};
