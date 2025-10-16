import API from "../config/axios-config";

export interface LoanApplication {
  applicationNumber: string;
  loanType: string;
  status: "DRAFT" | "PENDING_PARTNER_APPROVAL" | "PENDING_SUPER_ADMIN_APPROVAL" | "APPROVED" | "REJECTED" | "DISBURSED" | "CANCELLED";
  superAdminStatus?: "pending" | "approved" | "rejected";
  requestedAmount: number;
  approvedAmount?: number;
  tenure: number;
  products: number;
  created: string;
  factoryId?: string;
  agentId?: string;
  borrowerName?: string;
  interestRate?: number;
  purpose?: string;
  documents?: any[];
  riskScore?: number;
}

export interface LoanApplicationFilters {
  status?: string;
  loanType?: string;
  tenure?: number;
  factoryId?: string;
  agentId?: string;
  searchTerm?: string;
}

export interface ApprovalRequest {
  applicationNumber: string;
  approvedAmount?: number;
  interestRate?: number;
  remarks?: string;
}

export interface RejectionRequest {
  applicationNumber: string;
  reason: string;
  remarks?: string;
}

class LoanApplicationService {
  // Get all loan applications
  async getAllLoanApplications(): Promise<LoanApplication[]> {
    try {
      const response = await API.get('/v1/loan-applications/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all loan applications:', error);
      throw error;
    }
  }

  // Get loan application by application number
  async getLoanApplicationByNumber(applicationNumber: string): Promise<LoanApplication> {
    try {
      console.log(`Fetching loan application: ${applicationNumber}`);
      const response = await API.get(`/v1/loan-applications/${applicationNumber}`);
      console.log('API Response structure:', {
        status: response.status,
        data: response.data,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : 'No data'
      });
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        throw new Error('No data received from API');
      }
    } catch (error) {
      console.error('Error fetching loan application:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  }

  // Get loan application by ID (alias for getLoanApplicationByNumber)
  async getLoanApplicationById(id: string): Promise<LoanApplication> {
    return this.getLoanApplicationByNumber(id);
  }

  // Get loan applications by status
  async getLoanApplicationsByStatus(status: string): Promise<LoanApplication[]> {
    try {
      const response = await API.get(`/v1/loan-applications/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching loan applications by status:', error);
      throw error;
    }
  }

  // Get pending confirmation applications
  async getPendingConfirmationApplications(): Promise<LoanApplication[]> {
    try {
      const response = await API.get('/v1/loan-applications/pending-confirmation');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending confirmation applications:', error);
      throw error;
    }
  }

  // Get loan applications by factory
  async getLoanApplicationsByFactory(factoryId: string): Promise<LoanApplication[]> {
    try {
      const response = await API.get(`/v1/loan-applications/factory/${factoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching loan applications by factory:', error);
      throw error;
    }
  }

  // Get loan applications by agent
  async getLoanApplicationsByAgent(agentId: string): Promise<LoanApplication[]> {
    try {
      const response = await API.get(`/v1/loan-applications/agent/${agentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching loan applications by agent:', error);
      throw error;
    }
  }

  // Get pending confirmation applications by agent
  async getPendingConfirmationByAgent(agentId: string): Promise<LoanApplication[]> {
    try {
      const response = await API.get(`/v1/loan-applications/agent/${agentId}/pending-confirmation`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending confirmation by agent:', error);
      throw error;
    }
  }

  // Create new loan application
  async createLoanApplication(applicationData: Partial<LoanApplication>): Promise<LoanApplication> {
    try {
      const response = await API.post('/v1/loan-applications', applicationData);
      return response.data;
    } catch (error) {
      console.error('Error creating loan application:', error);
      throw error;
    }
  }

  // Submit loan application
  async submitLoanApplication(applicationNumber: string): Promise<LoanApplication> {
    try {
      const response = await API.post(`/v1/loan-applications/${applicationNumber}/submit`);
      return response.data;
    } catch (error) {
      console.error('Error submitting loan application:', error);
      throw error;
    }
  }

  // Confirm loan application (agent action)
  async confirmLoanApplication(applicationNumber: string, confirmed: boolean): Promise<LoanApplication> {
    try {
      const response = await API.post(`/v1/loan-applications/${applicationNumber}/confirm`, {
        confirmed
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming loan application:', error);
      throw error;
    }
  }

  // Cancel loan application
  async cancelLoanApplication(applicationNumber: string): Promise<LoanApplication> {
    try {
      const response = await API.post(`/v1/loan-applications/${applicationNumber}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling loan application:', error);
      throw error;
    }
  }

  // Approve loan application (bank action)
  async approveLoanApplication(approvalData: ApprovalRequest): Promise<LoanApplication> {
    try {
      const response = await API.post(`/v1/loan-applications/${approvalData.applicationNumber}/approve`, {
        approvedAmount: approvalData.approvedAmount,
        interestRate: approvalData.interestRate,
        remarks: approvalData.remarks
      });
      return response.data;
    } catch (error) {
      console.error('Error approving loan application:', error);
      throw error;
    }
  }

  // Reject loan application (bank action)
  async rejectLoanApplication(rejectionData: RejectionRequest): Promise<LoanApplication> {
    try {
      const response = await API.post(`/v1/loan-applications/${rejectionData.applicationNumber}/reject`, {
        reason: rejectionData.reason,
        remarks: rejectionData.remarks
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting loan application:', error);
      throw error;
    }
  }

  // Bulk approve loan applications
  async bulkApproveLoanApplications(applicationNumbers: string[], approvalData: Omit<ApprovalRequest, 'applicationNumber'>): Promise<LoanApplication[]> {
    try {
      const promises = applicationNumbers.map(applicationNumber =>
        this.approveLoanApplication({ ...approvalData, applicationNumber })
      );
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error('Error bulk approving loan applications:', error);
      throw error;
    }
  }

  // Bulk reject loan applications
  async bulkRejectLoanApplications(applicationNumbers: string[], rejectionData: Omit<RejectionRequest, 'applicationNumber'>): Promise<LoanApplication[]> {
    try {
      const promises = applicationNumbers.map(applicationNumber =>
        this.rejectLoanApplication({ ...rejectionData, applicationNumber })
      );
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error('Error bulk rejecting loan applications:', error);
      throw error;
    }
  }

  // Get filtered loan applications
  async getFilteredLoanApplications(filters: LoanApplicationFilters): Promise<LoanApplication[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.loanType) queryParams.append('loanType', filters.loanType);
      if (filters.tenure) queryParams.append('tenure', filters.tenure.toString());
      if (filters.factoryId) queryParams.append('factoryId', filters.factoryId);
      if (filters.agentId) queryParams.append('agentId', filters.agentId);
      if (filters.searchTerm) queryParams.append('search', filters.searchTerm);

      const response = await API.get(`/v1/loan-applications/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered loan applications:', error);
      throw error;
    }
  }

  // Export loan applications to Excel
  async exportLoanApplications(filters?: LoanApplicationFilters): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.loanType) queryParams.append('loanType', filters.loanType);
        if (filters.tenure) queryParams.append('tenure', filters.tenure.toString());
        if (filters.factoryId) queryParams.append('factoryId', filters.factoryId);
        if (filters.agentId) queryParams.append('agentId', filters.agentId);
        if (filters.searchTerm) queryParams.append('search', filters.searchTerm);
      }

      const response = await API.get(`/v1/loan-applications/export?${queryParams.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting loan applications:', error);
      throw error;
    }
  }
}

export default new LoanApplicationService();
