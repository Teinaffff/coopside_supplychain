import API from '../config/axios-config';

export interface Document {
  id: number;
  name?: string;
  documentName?: string;
  type?: string;
  documentType?: string;
  uploadedAt?: string;
  status?: "Approved" | "Pending" | "Rejected"; // This is partner status from API (backward compatibility)
  partnerStatus?: "Approved" | "Pending" | "Rejected"; // Partner status (explicit)
  superAdminStatus?: "Approved" | "Pending" | "Rejected"; // Super Admin status
  url?: string;
  fileUrl?: string;
  size?: string;
  fileSize?: number;
  fileType?: string;
  documentNumber?: string;
  isVerified?: boolean;
  reviewComments?: string;
  verifiedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  approvedBy?: string;
  rejectedBy?: string;
}

class DocumentService {
  // Get user documents
  async getUserDocuments(userId: number | string): Promise<Document[]> {
    try {
      const response = await API.get(`/v1/documents/${userId}`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching user documents:', error);
      throw error;
    }
  }

  // Approve a document (Admin only)
  async approveDocument(documentId: number): Promise<Document> {
    try {
      const response = await API.put(`/v1/documents/${documentId}/approve`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error approving document:', error);
      throw error;
    }
  }

  // Reject a document (Admin only)
  async rejectDocument(documentId: number, reason?: string): Promise<Document> {
    try {
      const url = reason 
        ? `/v1/documents/${documentId}/reject?reason=${encodeURIComponent(reason)}`
        : `/v1/documents/${documentId}/reject`;
      const response = await API.put(url);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error rejecting document:', error);
      throw error;
    }
  }
}

export default new DocumentService();

