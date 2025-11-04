import API from "../config/axios-config";
import agentService from "./agentService";

export interface LoanApplication {
  applicationNumber: string;
  loanType: string;
  status: "DRAFT" | "PENDING_PARTNER_APPROVAL" | "PENDING_SUPER_ADMIN_APPROVAL" | "APPROVED" | "REJECTED" | "DISBURSED" | "CANCELLED";
  superAdminStatus?: "pending" | "approved" | "rejected";
  requestedAmount: number;
  approvedAmount?: number;
  fees?: number;
  interest?: number;
  agentStatus?: "PENDING" | "APPROVED" | "REJECTED";
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
  approved: boolean;
  approvedAmount: number;
  interestRate: number;
  processingFeePercentage: number;
  processingFeeFactor: number;
  approvalComment?: string;
  rejectionReason?: string;
}

export interface RejectionRequest {
  applicationNumber: string;
  approved: boolean;
  interestRate: number;
  processingFeePercentage: number;
  processingFeeFactor: number;
  rejectionReason: string;
  approvalComment?: string;
}

class LoanApplicationService {
  // Get all loan applications
  async getAllLoanApplications(): Promise<LoanApplication[]> {
    try {
      console.log('[API] Fetching real loan applications from /v1/loan-applications/all');
      const response = await API.get('/v1/loan-applications/all');
      console.log('[API] Response received:', {
        status: response.status,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        dataLength: Array.isArray(response.data) ? response.data.length : 'not an array',
        dataStructure: response.data?.data ? 'nested (response.data.data)' : 'direct (response.data)'
      });
      
      // Handle both nested and direct response structures
      const applications = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || response.data || []);
      
      console.log('[API] Returning', applications.length, 'real loan applications');
      return applications;
    } catch (error) {
      console.error('[API ERROR] Failed to fetch real loan applications:', error);
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
      const requestBody: any = {
        approved: true,
        interestRate: approvalData.interestRate,
        processingFeePercentage: approvalData.processingFeePercentage,
        processingFeeFactor: approvalData.processingFeeFactor,
        rejectionReason: approvalData.rejectionReason || ""
      };
      
      // Include approvedAmount only if it's provided and greater than 0
      if (approvalData.approvedAmount && approvalData.approvedAmount > 0) {
        requestBody.approvedAmount = approvalData.approvedAmount;
      }
      
      console.log("=== APPROVAL API REQUEST ===");
      console.log("Endpoint:", `/v1/admin/approvals/${approvalData.applicationNumber}/approve`);
      console.log("Request body:", requestBody);
      
      const response = await API.post(`/v1/admin/approvals/${approvalData.applicationNumber}/approve`, requestBody);
      
      console.log("=== APPROVAL API RESPONSE ===");
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      
      // Handle both direct data and nested data structure
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('=== APPROVAL API ERROR ===');
      console.error('Error:', error);
      console.error('Error response:', error?.response);
      console.error('Error response data:', error?.response?.data);
      console.error('Error response status:', error?.response?.status);
      console.error('Error message:', error?.message);
      throw error;
    }
  }

  // Reject loan application (bank action)
  // Note: This endpoint should only update the superAdminStatus field to "rejected",
  // and should not affect the main loan application status field or partner status.
  // The main status should remain unchanged (e.g., if partner approved, status stays APPROVED,
  // but superAdminStatus becomes "rejected").
  async rejectLoanApplication(rejectionData: RejectionRequest): Promise<LoanApplication> {
    try {
      // Structure the request body similar to approve to ensure it only affects super admin status
      const requestBody: any = {
        approved: false,
        interestRate: rejectionData.interestRate,
        processingFeePercentage: rejectionData.processingFeePercentage,
        processingFeeFactor: rejectionData.processingFeeFactor,
        rejectionReason: rejectionData.rejectionReason
      };
      
      // Don't include approvedAmount for reject (it should be 0 or not set)
      // This ensures the backend knows this is a super admin rejection, not a partner rejection
      
      console.log("=== REJECT API REQUEST ===");
      console.log("Endpoint:", `/v1/admin/approvals/${rejectionData.applicationNumber}/reject`);
      console.log("Request body:", requestBody);
      console.log("This should only update superAdminStatus to 'rejected'");
      console.log("Main status and partner status should remain unchanged");
      
      const response = await API.post(`/v1/admin/approvals/${rejectionData.applicationNumber}/reject`, requestBody);
      
      console.log("=== REJECT API RESPONSE ===");
      console.log("Response data:", response.data);
      console.log("Super admin status should be updated to 'rejected'");
      console.log("Main status should remain unchanged");
      
      // Handle both direct data and nested data structure
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('=== REJECT API ERROR ===');
      console.error('Error:', error);
      console.error('Error response:', error?.response);
      console.error('Error response data:', error?.response?.data);
      console.error('Error response status:', error?.response?.status);
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
