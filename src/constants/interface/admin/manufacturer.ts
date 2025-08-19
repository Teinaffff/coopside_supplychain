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

interface BankAccountInfo {
  accountNumber: string;
  accountName: string;
  bankName: string;
  branchName: string;
  swiftCode: string;
  iban: string;
}

export interface Manufacturer extends Timestamps {
  id: number;
  factoryName: string;
  factoryCode: string;
  factoryType: string;
  tinNumber: string;
  registrationNumber: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  headOfficeAddress: Address;
  factoryAddresses: Address[];
  gpsCoordinates: string;
  website: string;
  phoneNumber: string;
  faxNumber: string;
  contactPerson: string;
  alternateContactPerson: string;
  operatingLicenses: string[];
  certifications: string[];
  mainProducts: string[];
  productionCapacity: string;
  productionLines: string[];
  machineryList: string[];
  rawMaterialSources: string[];
  warehouseCapacity: string;
  numberOfEmployees: number;
  hrContact: string;
  suppliers: string[];
  distributors: string[];
  exportImportLicenses: string[];
  bankAccountInfo: BankAccountInfo;
  preferredCurrency: string;
  billingAddress: Address;
  paymentTerms: string;
  erpSystem: string;
  apiIntegrationId: string;
}
