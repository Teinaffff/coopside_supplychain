interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  memberId?: number;
  name: string;
  email: string;
  age: number;
  city: string;
  subcity: string;
  woreda: string;
  startDate: string;
  photo: File;
  registrationFee: number;
  share: number;
  collateral: string;
  inheritor: string;
}

export interface PCMemberSliceType {
  membersList: Member[];
}

export interface MemberShares {
  id: number;
  shareName: string;
  quantity: number;
  pricePerShare: number;
  totalPrice: number;
  purchaseDate: string;
  profit: number;
  status: string;
}
