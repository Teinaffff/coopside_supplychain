interface AddressProps {
  region: string;
  zone: string;
  woreda: string;
  kebele: string;
}

interface IDNumberProps {
  type: string;
  value: string;
}

export interface ChangePersonalInformation {
  fullName: string;
  phone: string;
  email?: string;
  address: AddressProps;
  // idNumber: IDNumberProps;
}

export interface ChangePcInformation {
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  licenseNo: string;
  tinNo: string;
  accNo: string;
  companyAddress: AddressProps;
}
export interface ChangeProfileProps
  extends ChangePersonalInformation,
    ChangePcInformation {}

export interface City {
  id: number;
  createdAt: string;
  cityName: string;
  isEnabled: boolean;
  subcities: Subcity[];
}

export interface Subcity {
  id: number;
  createdAt: string;
  subcityName: string;
  cityName: string;
  isEnabled: boolean;
  woredas: Woreda[];
}

export interface Woreda {
  id: number;
  createdAt: string;
  woredaName: string;
  subcityName: string;
}

export interface IdTypes {
  label: string;
  value: string;
}

export interface EducationLevel {
  id: number;
  createdAt: string;
  title: string;
  description: string;
}
