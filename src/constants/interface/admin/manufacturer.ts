interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface Manufacturer extends Timestamps {
  manufacturerId?: string;
  name: string;
  email: string;
  phone: string;
  contactPerson: string;
  businessType: string;
  city: string;
  subcity: string;
  woreda: string;
  establishedDate: string;
  manufacturerStatus: string;
  logoUrl?: string;
}

