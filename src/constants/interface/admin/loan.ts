interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface Borrower {
  id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
}

export interface Lender {
  id: string;
  name: string;
  type: string;
}

export interface PaymentHistory {
  paymentId: string;
  amount: number;
  paymentDate: string;
  status: string;
  principalAmount: number;
  interestAmount: number;
}

export interface Loan extends Timestamps {
  id: string;
  loanId: string;
  loanType: string;
  borrower: Borrower;
  lender: Lender;
  amount: number;
  currency: string;
  interestRate: number;
  term: number; // months
  status: string;
  purpose: string;
  disbursementDate: string | null;
  maturityDate: string;
  outstandingBalance: number;
  monthlyPayment: number;
  nextPaymentDate: string | null;
  collateral: string;
  guarantor: string;
  approvedBy: string | null;
  approvedDate: string | null;
  documents: string[];
  paymentHistory: PaymentHistory[];
}

export interface LoanStatus {
  label: string;
  value: string;
  color: string;
}

export interface LoanType {
  label: string;
  value: string;
}
