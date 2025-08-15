interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface Agent extends Timestamps {
  agentId?: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  city: string;
  subcity: string;
  woreda: string;
  startDate: string;
  agentStatus: string;
  photoUrl?: string;
}
