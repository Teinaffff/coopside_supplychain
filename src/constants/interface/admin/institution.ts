interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface Institution extends Timestamps {
  institutionId?: string;
  name: string;
  email: string;
  phone: string;
  institutionType: string;
  contactPerson: string;
  city: string;
  subcity: string;
  woreda: string;
  establishedDate: string;
  institutionStatus: string;
  logoUrl?: string;
}
