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
  pcName: string;
  pcPhone: string;
  pcEmail: string;
  licenseNo: string;
  tinNo: string;
  accNo: string;
  purpose: string;
  pcAddress: AddressProps;
}
export interface ChangeProfileProps
  extends ChangePersonalInformation,
    ChangePcInformation {}


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
