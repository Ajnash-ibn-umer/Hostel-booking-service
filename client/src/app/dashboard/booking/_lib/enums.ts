export enum BookingStatus {
  INIT = 1,
  FORM_COMPLETED = 2,
  PAYMENT_FAILED = 3,
  BOOKING_COMPLETED = 4,
  ADMIN_APPROVED = 5,
  CHECK_IN = 6,
}
export enum BedAvailabilityStatus {
  AVAILABLE = 0,
  ENGAGED = 1,
  OCCUPIED = 2,
  NOT_AVAILABLE = 3,
}

export enum PRICE_BASE_MODE {
  DEFAULT = -1,
  DAILY = 1,
  MONTHLY = 2,
  BOTH = 3,
}

export enum BED_POSITION {
  LOWER = 1,
  UPPER = 2,
  DEFAULT = -1,
}

export type Booking = {
  _id: string;
  arrivalTime: Date;
  basePrice: number;
  bedId: string;
  bedName: string;
  bookingNumber: string;
  bookingStatus: BookingStatus;
  canteenFacility: boolean;
  laudryFacility: boolean;
  email: string;
  name: string;
  phone: string;
  propertyId: string;
  regNo: string;
  netAmount: number;
  roomId: string;
  securityDeposit: number;
  bedPosition: number;
  idProofDocUrls: string[];
  selectedPaymentBase: string;
  status: number;
  createdAt: Date;
  checkInDate: Date;
  checkOutDate: Date;
  address: string;
  bloodGroup: string;
  city: string;
  companyName: string;
  dob: Date;
  emergencyName: string;
  emergencyMobile: string;
  emergenyRelation: string;
  jobTitle: string;
  userRemark: string;
  property: {
    name: string;
    _id: string;
  };
};