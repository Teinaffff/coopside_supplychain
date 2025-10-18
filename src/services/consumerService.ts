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

      // Send reason in request body (backend expects @RequestBody)
      const url = `/v1/consumers/${consumerId}/reject`;
      const requestData = { reason: reason.trim() };
      console.log("[REJECT CONSUMER] URL:", url, "Data:", requestData);
      
      const response = await API.post(url, requestData);
      
      console.log("[REJECT CONSUMER] Response:", response.status, response.data);
      
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to reject consumer");
      }
      
      return response.data;
    } catch (error: any) {
      console.error("[REJECT CONSUMER ERROR]", error);
      
      if (error?.response?.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (error?.response?.status === 403) {
        throw new Error("You don't have permission to reject consumers.");
      } else if (error?.response?.status === 404) {
        throw new Error("Consumer not found.");
      } else if (error?.response?.status === 400) {
        throw new Error(error?.response?.data?.message || "Invalid request. Please check the consumer data.");
      } else if (error?.response?.status === 500) {
        throw new Error(error?.response?.data?.message || "Server error occurred while rejecting consumer.");
      }
      
      throw error;
    }
  }
}

export default new ConsumerService();
