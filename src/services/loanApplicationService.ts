import API from "../config/axios-config";
import agentService from "./agentService";

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
  // Additional fields for enhanced display
  loanTypeCode?: string;
  loanTypeName?: string;
  requestDate?: string;
  submissionDate?: string;
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

  // Get all loan applications with enriched agent data
  async getAllLoanApplicationsWithAgentData(): Promise<LoanApplication[]> {
    try {
      const applications = await this.getAllLoanApplications();
      console.log('Raw applications from API:', applications);
      
      // Get unique agent IDs from all applications
      const agentIds = [...new Set(applications
        .map(app => {
          console.log('App agentId:', app.agentId, 'Type:', typeof app.agentId);
          return app.agentId?.toString();
        })
        .filter(Boolean)
      )];
      
      console.log('Unique agent IDs found:', agentIds);
      
      // Try to fetch all agents first, then match by ID
      let agentDataMap = new Map();
      
      try {
        console.log('Attempting to fetch all agents...');
        const allAgents = await agentService.getAllAgents();
        console.log('All agents fetched:', allAgents);
        
        // Create a map of agents by ID
        allAgents.forEach(agent => {
          const agentId = agent.id?.toString() || agent.agentId?.toString();
          if (agentId) {
            agentDataMap.set(agentId, agent);
            console.log(`Mapped agent ID ${agentId} to agent:`, agent);
          }
        });
        
        // For any agent IDs not found in the all agents list, try individual fetch
        const missingAgentIds = agentIds.filter(id => !agentDataMap.has(id));
        console.log('Missing agent IDs:', missingAgentIds);
        
        if (missingAgentIds.length > 0) {
          await Promise.all(
            missingAgentIds.map(async (agentId) => {
              try {
                console.log(`Attempting individual fetch for agent ID: ${agentId}`);
                const agent = await agentService.getAgentById(agentId);
                console.log(`Successfully fetched agent data for ID ${agentId}:`, agent);
                agentDataMap.set(agentId, agent);
              } catch (error) {
                console.warn(`Failed to fetch agent data for ID ${agentId}:`, error);
                console.warn(`Error details:`, error.response?.data || error.message);
                // Set a fallback object for failed agent fetches
                agentDataMap.set(agentId, { id: agentId, fullName: 'Unknown Agent' });
              }
            })
          );
        }
      } catch (error) {
        console.warn('Failed to fetch all agents, trying individual fetches:', error);
        
        // Fallback to individual fetches
        await Promise.all(
          agentIds.map(async (agentId) => {
            try {
              console.log(`Attempting to fetch agent data for ID: ${agentId}`);
              const agent = await agentService.getAgentById(agentId);
              console.log(`Successfully fetched agent data for ID ${agentId}:`, agent);
              agentDataMap.set(agentId, agent);
            } catch (error) {
              console.warn(`Failed to fetch agent data for ID ${agentId}:`, error);
              console.warn(`Error details:`, error.response?.data || error.message);
              // Set a fallback object for failed agent fetches
              agentDataMap.set(agentId, { id: agentId, fullName: 'Unknown Agent' });
            }
          })
        );
      }
      
      console.log('Agent data map:', agentDataMap);
      
      // Enrich applications with agent data
      const enrichedApplications = applications.map(app => {
        const agentData = app.agentId ? agentDataMap.get(app.agentId.toString()) : null;
        console.log(`Processing app ${app.applicationNumber}: agentId=${app.agentId}, agentData=`, agentData);
        
        const enrichedApp = {
          ...app,
          borrowerName: agentData 
            ? agentData.fullName || agentData.fullLegalName || agentData.name || app.borrowerName || 'N/A'
            : app.borrowerName || 'N/A'
        };
        console.log(`Enriched app ${app.applicationNumber}: agentId=${app.agentId}, borrowerName=${enrichedApp.borrowerName}`);
        return enrichedApp;
      });
      
      return enrichedApplications;
    } catch (error) {
      console.error('Error fetching loan applications with agent data:', error);
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
