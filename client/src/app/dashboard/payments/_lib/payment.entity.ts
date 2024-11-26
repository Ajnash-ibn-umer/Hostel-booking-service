export type Payment = {
  _id: string;
  createdAt: Date;
  createdUserId: string;
  dueDate: Date;
  invoiceId: string;
  payAmount: number;
  payedDate: Date;
  paymentStatus: number;
  receivedAmount: number;
  status: number;
  updatedAt: Date;
  updatedUserId: string;
  userId: string;
  voucherId: string;
  voucherType: VOUCHER_TYPE;
  user: {
    name: string;
    _id: string;
    userNo: string;
  };
};

export enum VOUCHER_TYPE {
  RENT = 1,

  LAUNDRY = 2,

  DAMAGE_AND_SPLIT = 3,

  SECURITY_DEPOSIT = 4,

  OTHER = 10,
}

export enum PAYMENT_STATUS {
  PENDING = 0,
  PAYED = 1,
}
