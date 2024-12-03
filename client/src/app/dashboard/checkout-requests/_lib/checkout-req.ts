export enum CHECKOUT_REQUEST_STATUS {
  PENDING = 1,

  CANCELED = 2,

  APPROVED = 3,
}

export type CheckoutRequest = {
  _id: string;
  bedId: string;
  bookingId: string;
  contractId: string;
  createdAt: Date;
  createdUserId: string;
  description: string;
  guestId: string;
  guestNo: string;
  hostelId: string;
  roomId: string;
  status: string;
  updatedAt: Date;
  updatedUserId: string;
  vaccatingDate: Date;
  bed: {
    _id: string;
    name: string;
  };
  guest: {
    _id: string;
    name: string;
    email: string;
  };
  checkoutApprovalStatus: CHECKOUT_REQUEST_STATUS;
};
