import API from '../config/axios-config';

export interface Factory {
  id: number;
  name?: string;
  factoryName?: string;
  businessName?: string;
  registrationNo?: string;
  registrationNumber?: string;
  businessLicense?: string;
  location?: string;
  address?: string;
  factoryLocation?: string;
  tin?: string;
  taxId?: string;
  contact?: string;
  contactPerson?: string;
  phone?: string;
  phoneNumber?: string;
  contactPhone?: string;
  email?: string;
  emailAddress?: string;
  contactEmail?: string;
  industry?: string;
  industryType?: string;
  businessSector?: string;
  bankAccount?: string;
  bankDetails?: string;
  capacity?: string;
  productionCapacity?: string;
  linkedCoops?: string;
  linkedCooperatives?: string;
  superAdminApprovalStatus?: string;
  adminApprovalStatus?: string;
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
      
      // Return the data directly - most APIs return the object directly
      return response.data;
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
