interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface Consumer extends Timestamps {
  consumerId?: string;
  institutionId?: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  city: string;
  subcity: string;
  woreda: string;
  registrationDate: string;
  consumerStatus: string;
  photoUrl?: string;
}
