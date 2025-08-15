interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface Seller extends Timestamps {
  sellerId?: string;
  name: string;
  email: string;
  phone: string;
  chairperson: string;
  memberCount: number;
  city: string;
  subcity: string;
  woreda: string;
  establishedDate: string;
  sellerStatus: string;
  logoUrl?: string;
}

