export interface CheckInGuestUserList {
  phoneNumber: string;
  email: string;
  name: string;
  isActive: boolean;
  userNo: string;
  _id: string;
  contract: {
    _id: string;
    bedId: string;
    laundryMonthlyCount: number;
    status: string;
  };
}
