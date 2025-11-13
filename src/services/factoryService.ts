import API from '../config/axios-config';

export interface BankAccount {
  id?: number;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  branchName?: string;
  swiftCode?: string;
  iban?: string;
  isPrimary?: boolean;
}

export interface Factory {
  id: number;
  name?: string;
  factoryName?: string;
  businessName?: string;
  registrationNo?: string;
  registrationNumber?: string;
  businessLicense?: string;
  licenseNumber?: string;
  licenseExpirationDate?: string;
  licenseExpiryDate?: string;
  location?: string;
  address?: string;
  factoryLocation?: string;
  tin?: string;
  tinNumber?: string;
  taxId?: string;
  contact?: string;
  contactPerson?: string;
  alternateContactPerson?: string;
  phone?: string;
  phoneNumber?: string;
  contactPhone?: string;
  email?: string;
  emailAddress?: string;
  contactEmail?: string;
  industry?: string;
  industryType?: string;
  businessSector?: string;
  factoryType?: string;
  bankAccount?: string;
  bankDetails?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankAccounts?: BankAccount[];
  bankAccountInfo?: BankAccount[];
  accountName?: string;
  bankBranch?: string;
  capacity?: string;
  productionCapacity?: string;
  linkedCoops?: string;
  linkedCooperatives?: string;
  superAdminApprovalStatus?: string;
  adminApprovalStatus?: string;
  adminApprovedBy?: number;
  adminApprovedAt?: string;
  documents?: any[];
  [key: string]: any;
}

class FactoryService {
  // Get factory by ID
  async getFactoryById(factoryId: string): Promise<Factory> {
    try {
      console.log('Fetching factory with ID:', factoryId);
      const response = await API.get(`/v1/factories/${factoryId}`);
      console.log('Factory API response:', response);
      console.log('Factory API response data:', response.data);
      console.log('Factory API response.data.data:', response.data?.data);
      console.log('Factory API response keys:', Object.keys(response.data || {}));
      
      // Handle different response structures - check for nested data or direct data
      const factoryData = response.data?.data || response.data;
      console.log('Factory data to return:', factoryData);
      console.log('Factory data keys:', Object.keys(factoryData || {}));
      
      // Return the data - handle both nested and direct response structures
      return factoryData;
    } catch (error) {
      console.error('Error fetching factory by ID:', error);
      console.error('Factory ID attempted:', factoryId);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get all factories
  async getAllFactories(): Promise<Factory[]> {
    try {
      const response = await API.get('/v1/factories');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching factories:', error);
      throw error;
    }
  }
}

export default new FactoryService();
