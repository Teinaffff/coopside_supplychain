interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}


interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Seller extends Timestamps {
  id?: number;
  username: string;
  email: string;
  fullName: string;
  agentType: string;
  idNumber: string;
  commissionRate: number;
  phoneNumber: string;
  address: Address;
  isActive: boolean;
  bankAccountNumber: string;
  taxIdentificationNumber: string;
  profilePictureUrl?: string;
}
