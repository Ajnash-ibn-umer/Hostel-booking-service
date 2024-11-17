export enum COMPLAINT_STATUS {
  REQUEST_SENT = 0,
  PENDING = 1,
  REJECTED = 2,
  ACTION_TAKEN = 3,
}

export interface Complaint {
  _id: string;
  createdAt: string;
  createdUserId: string;
  description: string;
  propertyId: string;
  requestStatus: COMPLAINT_STATUS;
  roomId: string;
  status: number;
  title: string;
  updatedAt: string;
  updatedUserId: string;
  userId: string;
  property: {
    name: string;
    _id: string;
  };
  galleries: {
    _id: string;
    name: string;
    status: string;
    url: string;
  }[];
  room: {
    _id: string;
    name: string;
  };
  user: {
    email: string;
    name: string;
    _id: string;
    userNo: string;
  };
}
