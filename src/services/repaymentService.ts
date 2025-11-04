import API from "../config/axios-config";

export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "MOBILE_MONEY" | string;

export interface RepaymentDetailsResponse {
  applicationNumber: string;
  borrowerName?: string;
  loanType?: string;
  principalAmount?: number;
  disbursedAmount?: number;
  totalDue?: number;
  totalPaid?: number;
  outstanding?: number;
  schedule?: Array<{
    installmentNo: number;
    dueDate: string;
    amount: number;
    status?: string;
    paidAmount?: number;
  }>;
  payments?: Array<{
    id?: string;
    date: string;
    amount: number;
    method?: PaymentMethod;
    status?: string;
  }>;
}

export interface ProcessPaymentPayload {
  loanApplicationNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface RepaymentItem {
  id: number;
  applicationNumber: string;
  totalLoanAmount: number;
  interestRate: number;
  tenureMonths: number;
  paidAmount: number;
  remainingAmount: number;
  repaymentProgress: number;
  monthlyInstallment: number;
  nextPaymentAmount: number;
  totalInstallments: number;
  paidInstallments: number;
  dueDate: string;
  nextPaymentDate: string;
  penaltyAmount: number;
  penaltyRate: number;
  isOverdue: boolean;
  overdueDays: number;
  prepaymentAllowed: boolean;
  prepaymentPenaltyRate: number;
  prepaymentPenaltyAmount: number;
  totalInterestAmount: number;
  paidInterestAmount: number;
  remainingInterestAmount: number;
  status: string;
  lastPaymentDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

async function getRepaymentDetails(applicationNumber: string): Promise<RepaymentDetailsResponse> {
  const { data } = await API.get(`/v1/repayments/loan/${encodeURIComponent(applicationNumber)}`);
  return (data?.data ?? data) as RepaymentDetailsResponse;
}

async function getRepaymentsByLoan(applicationNumber: string): Promise<RepaymentItem[]> {
  const { data } = await API.get(`/v1/repayments/loan/${encodeURIComponent(applicationNumber)}`);
  const response = data?.data ?? data;
  // Handle both array and single object responses
  return Array.isArray(response) ? response : [response].filter(Boolean);
}

async function getRepaymentsByAgent(agentId: string): Promise<RepaymentItem[]> {
  const { data } = await API.get(`/v1/repayments/agent/${encodeURIComponent(agentId)}`);
  const response = data?.data ?? data;
  return Array.isArray(response) ? response : [response].filter(Boolean);
}

async function processPayment(payload: ProcessPaymentPayload) {
  const { data } = await API.post(`/v1/repayments/payment`, payload);
  return data?.data ?? data;
}

const repaymentService = {
  getRepaymentDetails,
  getRepaymentsByLoan,
  getRepaymentsByAgent,
  processPayment,
};

export default repaymentService;


