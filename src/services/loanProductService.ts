import API from "../config/axios-config";

export interface LoanProduct {
  id: number;
  code: string;
  name: string;
  description: string;
  defaultInterestRate: number;
  minInterestRate: number;
  maxInterestRate: number;
  defaultRepaymentPeriodMonths: number;
  minRepaymentPeriodMonths: number;
  maxRepaymentPeriodMonths: number;
  minLoanAmount: number;
  maxLoanAmount: number;
  processingFeeType: "PERCENTAGE" | "FIXED";
  processingFeeValue: number;
  minProcessingFee: number;
  maxProcessingFee: number;
  latePaymentPenaltyRate: number;
  prepaymentAllowed: boolean;
  prepaymentPenaltyRate: number;
  collateralRequired: boolean;
  guarantorRequired: boolean;
  minCreditScore: number;
  requiredDocuments: string[];
  requiresPartnerApproval: boolean;
  requiresAdminApproval: boolean;
  autoApproveThreshold: number;
  minScoreForAutoApprove: number;
  isActive: boolean;
  displayOrder: number;
  additionalSettings: any;
  termsAndConditions: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number | null;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: number | null;
}

export interface CreateLoanProductRequest {
  code: string;
  name: string;
  description: string;
  defaultInterestRate: number;
  minInterestRate: number;
  maxInterestRate: number;
  defaultRepaymentPeriodMonths: number;
  minRepaymentPeriodMonths: number;
  maxRepaymentPeriodMonths: number;
  minLoanAmount: number;
  maxLoanAmount: number;
  processingFeeType: "PERCENTAGE" | "FIXED";
  processingFeeValue: number;
  minProcessingFee: number;
  maxProcessingFee: number;
  latePaymentPenaltyRate: number;
  prepaymentAllowed: boolean;
  prepaymentPenaltyRate: number;
  collateralRequired: boolean;
  guarantorRequired: boolean;
  minCreditScore: number;
  requiredDocuments: string; // JSON string for API
  requiresPartnerApproval: boolean;
  requiresAdminApproval: boolean;
  autoApproveThreshold: number;
  minScoreForAutoApprove: number;
  displayOrder: number;
  additionalSettings?: any;
  termsAndConditions: string;
}

export interface UpdateLoanProductRequest extends Partial<CreateLoanProductRequest> {
  id: number;
}

export interface LoanProductFilters {
  search?: string;
  isActive?: boolean;
  collateralRequired?: boolean;
  guarantorRequired?: boolean;
  requiresPartnerApproval?: boolean;
  requiresAdminApproval?: boolean;
  minLoanAmount?: number;
  maxLoanAmount?: number;
  minInterestRate?: number;
  maxInterestRate?: number;
}

class LoanProductService {
  // Get all loan types
  async getAllLoanTypes(filters?: LoanProductFilters): Promise<{ success: boolean; data: LoanProduct[] }> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters?.collateralRequired !== undefined) params.append('collateralRequired', filters.collateralRequired.toString());
      if (filters?.guarantorRequired !== undefined) params.append('guarantorRequired', filters.guarantorRequired.toString());
      if (filters?.requiresPartnerApproval !== undefined) params.append('requiresPartnerApproval', filters.requiresPartnerApproval.toString());
      if (filters?.requiresAdminApproval !== undefined) params.append('requiresAdminApproval', filters.requiresAdminApproval.toString());
      if (filters?.minLoanAmount) params.append('minLoanAmount', filters.minLoanAmount.toString());
      if (filters?.maxLoanAmount) params.append('maxLoanAmount', filters.maxLoanAmount.toString());
      if (filters?.minInterestRate) params.append('minInterestRate', filters.minInterestRate.toString());
      if (filters?.maxInterestRate) params.append('maxInterestRate', filters.maxInterestRate.toString());

      const response = await API.get(`/v1/loan-types?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching loan types:', error);
      throw error;
    }
  }

  // Get loan type by ID
  async getLoanTypeById(loanTypeId: number): Promise<{ success: boolean; data: LoanProduct }> {
    try {
      const response = await API.get(`/v1/loan-types/${loanTypeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching loan type by ID:', error);
      throw error;
    }
  }

  // Get loan type by code
  async getLoanTypeByCode(code: string): Promise<{ success: boolean; data: LoanProduct }> {
    try {
      const response = await API.get(`/v1/loan-types/code/${code}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching loan type by code:', error);
      throw error;
    }
  }

  // Get active loan types
  async getActiveLoanTypes(): Promise<{ success: boolean; data: LoanProduct[] }> {
    try {
      const response = await API.get('/v1/loan-types/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active loan types:', error);
      throw error;
    }
  }

  // Get loan types requiring partner approval
  async getLoanTypesRequiringPartnerApproval(): Promise<{ success: boolean; data: LoanProduct[] }> {
    try {
      const response = await API.get('/v1/loan-types/partner-approval');
      return response.data;
    } catch (error) {
      console.error('Error fetching loan types requiring partner approval:', error);
      throw error;
    }
  }

  // Get loan types requiring admin approval
  async getLoanTypesRequiringAdminApproval(): Promise<{ success: boolean; data: LoanProduct[] }> {
    try {
      const response = await API.get('/v1/loan-types/admin-approval');
      return response.data;
    } catch (error) {
      console.error('Error fetching loan types requiring admin approval:', error);
      throw error;
    }
  }

  // Get loan types by collateral requirement
  async getLoanTypesByCollateralRequirement(collateralRequired: boolean): Promise<{ success: boolean; data: LoanProduct[] }> {
    try {
      const response = await API.get(`/v1/loan-types/collateral/${collateralRequired}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching loan types by collateral requirement:', error);
      throw error;
    }
  }

  // Check if loan type code exists
  async checkLoanTypeCodeExists(code: string): Promise<{ success: boolean; data: { exists: boolean } }> {
    try {
      const response = await API.get(`/v1/loan-types/exists/${code}`);
      return response.data;
    } catch (error) {
      console.error('Error checking loan type code existence:', error);
      throw error;
    }
  }

  // Create loan type
  async createLoanType(loanTypeData: CreateLoanProductRequest): Promise<{ success: boolean; data: LoanProduct }> {
    try {
      const response = await API.post('/v1/loan-types', loanTypeData);
      return response.data;
    } catch (error) {
      console.error('Error creating loan type:', error);
      throw error;
    }
  }

  // Update loan type
  async updateLoanType(loanTypeId: number, loanTypeData: Partial<CreateLoanProductRequest>): Promise<{ success: boolean; data: LoanProduct }> {
    try {
      const response = await API.put(`/v1/loan-types/${loanTypeId}`, loanTypeData);
      return response.data;
    } catch (error) {
      console.error('Error updating loan type:', error);
      throw error;
    }
  }

  // Activate loan type
  async activateLoanType(loanTypeId: number): Promise<{ success: boolean; data: LoanProduct }> {
    try {
      const response = await API.put(`/v1/loan-types/${loanTypeId}/activate`);
      return response.data;
    } catch (error) {
      console.error('Error activating loan type:', error);
      throw error;
    }
  }

  // Deactivate loan type
  async deactivateLoanType(loanTypeId: number): Promise<{ success: boolean; data: LoanProduct }> {
    try {
      const response = await API.put(`/v1/loan-types/${loanTypeId}/deactivate`);
      return response.data;
    } catch (error) {
      console.error('Error deactivating loan type:', error);
      throw error;
    }
  }

  // Delete loan type
  async deleteLoanType(loanTypeId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await API.delete(`/v1/loan-types/${loanTypeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting loan type:', error);
      throw error;
    }
  }
}

export default new LoanProductService();
