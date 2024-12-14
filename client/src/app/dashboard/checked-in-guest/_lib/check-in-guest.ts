import type { Booking } from "../../booking/_lib/enums";

export interface CheckInGuestUserList {
  phoneNumber: string;
  email: string;
  name: string;
  isActive: boolean;
  userNo: string;
  _id: string;
  booking: Booking;
  contract: {
    _id: string;
    bedId: string;
    laundryMonthlyCount: number;
    status: string;
  };
}
