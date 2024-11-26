import { Schema } from 'mongoose';
import { MODEL_NAMES } from './modelNames';
import { AmenitySchema } from './models/amenity.model';
import { BedSchema } from './models/bed.model';
import { BookingStatusHistorySchema } from './models/booking-status.model';
import { BookingSchema } from './models/booking.model';
import { CategorySchema } from './models/category.model';
import { CheckoutRequestSchema } from './models/checkout-request.model';
import { ComplaintReportStatusHistorySchema } from './models/complaints-history.model';
import { ComplaintSchema } from './models/complaints.model';
import { ContactUsSchema } from './models/contact-us.model';
import { ContractSchema } from './models/contract.model';
import { CounterSchema } from './models/counter.model';
import { DamageAndSplitDetailsSchema } from './models/damage-and-split-details.model';
import { DamageAndSplitSchema } from './models/damage-and-split.model';
import { GallerySchema } from './models/gallery.model';
import { HostelSchema } from './models/hostel.model';
import { InvoiceItemSchema } from './models/invoice-item.model';
import { InvoiceSchema } from './models/invoice.model';
import { ComplaintGalleryLinkSchema } from './models/join_tables/complaint_x_gallery.model';
import { HostelAmenitiesLinkSchema } from './models/join_tables/hostel_x_amenities.model';
import { HostelGalleryLinkSchema } from './models/join_tables/hostel_x_gallery.model';
import { RoomAmenitiesLinkSchema } from './models/join_tables/room_x_amenities.model';
import { RoomGalleryLinkSchema } from './models/join_tables/room_x_gallery.model';
import { LocationSchema } from './models/location.model';
import { PaymentSchema } from './models/payments.model';
import { RoomSchema } from './models/room.model';
import { RoomTypeSchema } from './models/roomTytpe.model';
import { PaymentTransactionSchema } from './models/transaction.model';
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

  bookingModel: {
    name: MODEL_NAMES.BOOKING,
    schema: BookingSchema,
  },
  bookingStatusHistoryModel: {
    name: MODEL_NAMES.BOOKING_STATUS_HISTORY,
    schema: BookingStatusHistorySchema,
  },
  invoiceItemsModel: {
    name: MODEL_NAMES.INVOICE_ITEMS,
    schema: InvoiceItemSchema,
  },
  invoicesModel: {
    name: MODEL_NAMES.INVOICES,
    schema: InvoiceSchema,
  },
  contractsModel: {
    name: MODEL_NAMES.CONTRACTS,
    schema: ContractSchema,
  },
  transactionsModel: {
    name: MODEL_NAMES.TRANSACTIONS,
    schema: PaymentTransactionSchema,
  },
  contactUsModel: {
    name: MODEL_NAMES.CONTACT_US,
    schema: ContactUsSchema,
  },

  complaintsModel: {
    name: MODEL_NAMES.COMPLAINTS,
    schema: ComplaintSchema,
  },
  complaintsStatusHistoryModel: {
    name: MODEL_NAMES.COMPLAINTS_STATUS_HISTORY,
    schema: ComplaintReportStatusHistorySchema,
  },

  complaintsGalleryLinkModel: {
    name: MODEL_NAMES.COMPLAINTS_GALLERY_LINKS,
    schema: ComplaintGalleryLinkSchema,
  },

  paymentsModel: {
    name: MODEL_NAMES.PAYMENTS,
    schema: PaymentSchema,
  },
  damageAndSplitModel: {
    name: MODEL_NAMES.DAMAGE_AND_SPLIT,
    schema: DamageAndSplitSchema,
  },
  damageAndSplitDetailsModel: {
    name: MODEL_NAMES.DAMAGE_AND_SPLIT_DETAILS,
    schema: DamageAndSplitDetailsSchema,
  },
  checkoutRequestModel: {
    name: MODEL_NAMES.CHECKOUT_REQUEST,
    schema: CheckoutRequestSchema,
  },
};
