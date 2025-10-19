import API from "../config/axios-config";

export interface DisbursementRequest {
  applicationNumber: string;
  agentId: string;
  remarks?: string;
}

export interface DisbursementResponse {
  id: string;
  applicationNumber: string;
  agentId: string;
  agentName: string;
  factoryId: string;
  factoryName: string;
  disbursedAmount: number;
  disbursedDate: string;
  loanAmount: number;
  loanFees: number;
  loanInterest: number;
  loanPeriod: number;
  loanStatus: string;
  loanApprovedDate: string;
  loanConfirmedDate: string;
  loanRejectedDate?: string;
  loanSettledDate?: string;
  loanDisbursedDate: string;
  loanDisbursementStatus: string;
  loanDisbursementRemarks?: string;
  loanDisbursementConfirmedDate?: string;
  loanDisbursementRejectedDate?: string;
  loanDisbursementSettledDate?: string;
  receipts: Array<{
    id: string;
    receiptNumber: string;
    receiptDate: string;
    receiptAmount: number;
    receiptStatus: string;
    disbursementStatus: string;
    disbursementDate?: string;
    disbursementConfirmedDate?: string;
    disbursementRejectedDate?: string;
    disbursementSettledDate?: string;
  }>;
}

export interface InvoiceResponse {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  applicationNumber: string;
  factoryId: string;
  agentId: string;
  dueDate: string;
  currency: string;
  originalAmount: number;
  approvedAmount: number;
  fees: number;
  interest: number;
  netAmount: number;
  status: string;
  disbursementStatus: string;
  agentStatus: string;
  factoryStatus: string;
  createdAt: string;
  updatedAt: string;
}

class DisbursementService {
  // Disburse loan to factory
  async disburseLoan(request: DisbursementRequest): Promise<DisbursementResponse> {
    try {
      console.log('Disbursement request:', request);
      const response = await API.post('/v1/disbursements/disburse', request);
      console.log('Disbursement response:', response);
      return response.data;
    } catch (error) {
      console.error('Error disbursing loan:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }

  // Get disbursement details by application number
  async getDisbursementByApplication(applicationNumber: string): Promise<DisbursementResponse> {
    try {
      const response = await API.get(`/v1/disbursements/application/${applicationNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching disbursement details:', error);
      throw error;
    }
  }

  // Get invoice by application number
  async getInvoiceByApplication(applicationNumber: string): Promise<InvoiceResponse> {
    try {
      const response = await API.get(`/v1/disbursements/invoice/application/${applicationNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      throw error;
    }
  }

  // Get factory invoices
  async getFactoryInvoices(factoryId: string): Promise<InvoiceResponse[]> {
    try {
      const response = await API.get(`/v1/disbursements/invoices/factory/${factoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching factory invoices:', error);
      throw error;
    }
  }

  // Get agent invoices
  async getAgentInvoices(agentId: string): Promise<InvoiceResponse[]> {
    try {
      const response = await API.get(`/v1/disbursements/invoices/agent/${agentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching agent invoices:', error);
      throw error;
    }
  }

  // Get invoice by invoice number
  async getInvoiceByNumber(invoiceNumber: string): Promise<InvoiceResponse> {
    try {
      const response = await API.get(`/v1/disbursements/invoice/${invoiceNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice by number:', error);
      throw error;
    }
  }

  // Get invoices by application number
  async getInvoicesByApplication(applicationNumber: string): Promise<InvoiceResponse> {
    try {
      const response = await API.get(`/v1/disbursements/invoices/application/${applicationNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices by application:', error);
      throw error;
    }
  }
}

export default new DisbursementService();
