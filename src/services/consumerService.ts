import API from '../config/axios-config';

export interface BankInfo {
  id: number;
  accountNumber: string;
  accountName: string;
  bankName: string;
  branchName: string;
  swiftCode: string;
  iban: string;
  isPrimary: boolean;
}

export interface Consumer {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  employeeId: string;
  tin: string;
  jobTitle: string;
  department: string;
  grossSalary: number;
  netSalary: number;
  employmentType: string;
  maritalStatus: string;
  numberOfDependants: number;
  approvedBy: string;
  approvedAt: string;
  rejectedBy: string;
  rejectedAt: string;
  bankInfo: BankInfo[];
  adminStatus: "Approved" | "Rejected" | "Pending";
  status: "Approved" | "Rejected" | "Pending";
  createdAt: string;
  institutionId: number;
  [key: string]: any;
}

class ConsumerService {
  // Get consumer by ID
  async getConsumerById(consumerId: number): Promise<Consumer> {
    try {
      const response = await API.get(`/v1/consumers/${consumerId}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching consumer by ID:', error);
      throw error;
    }
  }

  // Get consumers by institution ID
  async getConsumersByInstitution(institutionId: number): Promise<Consumer[]> {
    try {
      const response = await API.get(`/v1/consumers/institution/${institutionId}`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching consumers by institution:', error);
      throw error;
    }
  }

  // Approve consumer (Super Admin action)
  async approveConsumer(consumerId: number): Promise<void> {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No authentication token found. Please login again.");
      }

      // Validate consumerId is a number
      if (typeof consumerId !== 'number' || isNaN(consumerId)) {
        throw new Error(`Invalid consumer ID: ${consumerId} (type: ${typeof consumerId})`);
      }

      const url = `/v1/consumers/${consumerId}/approve`;
      console.log("[APPROVE CONSUMER] URL:", url, "ConsumerId:", consumerId);
      
      const response = await API.post(url);
      
      console.log("[APPROVE CONSUMER] Response:", response.status, response.data);
      
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to approve consumer");
      }
      
      return response.data;
    } catch (error: any) {
      console.error("[APPROVE CONSUMER ERROR]", error);
      
      if (error?.response?.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (error?.response?.status === 403) {
        throw new Error("You don't have permission to approve consumers.");
      } else if (error?.response?.status === 404) {
        throw new Error("Consumer not found.");
      } else if (error?.response?.status === 400) {
        throw new Error(error?.response?.data?.message || "Invalid request. Please check the consumer data.");
      } else if (error?.response?.status === 500) {
        throw new Error(error?.response?.data?.message || "Server error occurred while approving consumer.");
      }
      
      throw error;
    }
  }

  // Reject consumer (Super Admin action)
  async rejectConsumer(consumerId: number, reason: string): Promise<void> {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No authentication token found. Please login again.");
      }

      // Validate consumerId is a number
      if (typeof consumerId !== 'number' || isNaN(consumerId)) {
        throw new Error(`Invalid consumer ID: ${consumerId} (type: ${typeof consumerId})`);
      }

      // Validate reason is not empty
      if (!reason || reason.trim() === '') {
        throw new Error("Rejection reason is required");
      }

      // Send reason as query parameter (backend expects @RequestParam)
      const url = `/v1/consumers/${consumerId}/reject?reason=${encodeURIComponent(reason.trim())}`;
      console.log("[REJECT CONSUMER] URL:", url);
      
      const response = await API.post(url);
      
      console.log("[REJECT CONSUMER] Response:", response.status, response.data);
      
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to reject consumer");
      }
      
      return response.data;
    } catch (error: any) {
      console.error("[REJECT CONSUMER ERROR]", error);
      console.error("[REJECT CONSUMER ERROR] Response data:", error?.response?.data);
      console.error("[REJECT CONSUMER ERROR] Response status:", error?.response?.status);
      
      if (error?.response?.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (error?.response?.status === 403) {
        throw new Error("You don't have permission to reject consumers.");
      } else if (error?.response?.status === 404) {
        throw new Error("Consumer not found.");
      } else if (error?.response?.status === 400) {
        const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.response?.data?.detail || "Invalid request. Please check the consumer data.";
        console.error("[REJECT CONSUMER ERROR] Error message:", errorMessage);
        console.error("[REJECT CONSUMER ERROR] Full error data:", error?.response?.data);
        
        // Check for various forms of "cannot reject approved consumer" error
        const lowerErrorMessage = errorMessage.toLowerCase();
        if (lowerErrorMessage.includes("cannot reject") && lowerErrorMessage.includes("approved") ||
            lowerErrorMessage.includes("cannot reject an approved consumer") ||
            lowerErrorMessage.includes("already approved") ||
            lowerErrorMessage.includes("approved consumer")) {
          throw new Error("This consumer has already been approved and cannot be rejected. Please contact support if you need to change the status.");
        }
        throw new Error(errorMessage);
      } else if (error?.response?.status === 409) {
        throw new Error("This consumer has already been processed and cannot be rejected again.");
      } else if (error?.response?.status === 500) {
        throw new Error(error?.response?.data?.message || "Server error occurred while rejecting consumer.");
      }
      
      throw error;
    }
  }

  // Revoke consumer approval (Super Admin action) - for consumers of rejected institutions
  async revokeConsumerApproval(consumerId: number, reason: string): Promise<void> {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No authentication token found. Please login again.");
      }

      // Validate consumerId is a number
      if (typeof consumerId !== 'number' || isNaN(consumerId)) {
        throw new Error(`Invalid consumer ID: ${consumerId} (type: ${typeof consumerId})`);
      }

      // Validate reason is not empty
      if (!reason || reason.trim() === '') {
        throw new Error("Revocation reason is required");
      }

      // Send reason as query parameter (backend expects @RequestParam)
      const url = `/v1/consumers/${consumerId}/revoke?reason=${encodeURIComponent(reason.trim())}`;
      console.log("[REVOKE CONSUMER] URL:", url);
      
      const response = await API.post(url);
      
      console.log("[REVOKE CONSUMER] Response:", response.status, response.data);
      
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to revoke consumer approval");
      }
      
      return response.data;
    } catch (error: any) {
      console.error("[REVOKE CONSUMER ERROR]", error);
      console.error("[REVOKE CONSUMER ERROR] Response data:", error?.response?.data);
      console.error("[REVOKE CONSUMER ERROR] Response status:", error?.response?.status);
      
      if (error?.response?.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (error?.response?.status === 403) {
        throw new Error("You don't have permission to revoke consumer approvals.");
      } else if (error?.response?.status === 404) {
        throw new Error("Consumer not found.");
      } else if (error?.response?.status === 400) {
        const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.response?.data?.detail || "Invalid request. Please check the consumer data.";
        throw new Error(errorMessage);
      } else if (error?.response?.status === 500) {
        throw new Error(error?.response?.data?.message || "Server error occurred while revoking consumer approval.");
      }
      
      throw error;
    }
  }
}

export default new ConsumerService();
