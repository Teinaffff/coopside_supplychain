
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
  photo: string;
  registrationFee: number;
  share: number;
  collateral: string;
  inheritor: string;
}

export interface PCMemberSliceType {
  membersList: Member[];
}
