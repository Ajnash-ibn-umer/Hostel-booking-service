export interface DamageAndSplit {
  title: string;
  totalAmount: number;
  dueDate: string;
  status: number;
  receivedAmount: number;
  amountStatus: number;
  splitDetails: {
    _id: string;
    amount: number;
    payed: boolean;
    user: {
      name: string;
    };
  }[];
  hostel: {
    _id: string;
    name: string;
  };
}
