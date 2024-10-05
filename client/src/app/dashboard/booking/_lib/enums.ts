export enum BookingStatus {
    INIT = 1,
    FORM_COMPLETED = 2,
    PAYMENT_FAILED = 3,
    PAYMENT_SUCCESS = 4,
    ADMIN_APPROVED = 5,
    CHECK_IN = 6,
  }
  export enum BedAvailabilityStatus {
    AVAILABLE = 0,
    ENGAGED = 1,
    OCCUPIED = 2,
    NOT_AVAILABLE = 3,
  }