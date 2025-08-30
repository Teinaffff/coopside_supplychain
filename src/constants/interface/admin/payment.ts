interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

interface PaymentParty {
  id: string;
  name: string;
  type: string;
  email?: string;
  phone?: string;
}

interface RelatedEntity {
  id: string;
  type: string;
  description: string;
}

interface BankDetails {
  accountNumber: string;
  bankName: string;
  branchCode: string;
  swiftCode: string;
}

interface PaymentFees {
  transactionFee: number;
  processingFee: number;
  totalFees: number;
}

interface PaymentBreakdown {
  principalAmount?: number;
  interestAmount?: number;
  penaltyAmount?: number;
  productAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
}

export interface Payment extends Timestamps {
  id: string;
  paymentId: string;
  paymentType: string;
  status: string;
  approvalStatus?: string;
  priority?: string;

  // Parties involved
  payer: PaymentParty;
  payee: PaymentParty;
  relatedEntity: RelatedEntity;

  // Payment details
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId?: string;
  reference?: string;
  description?: string;

  // Dates
  paymentDate?: string;
  dueDate?: string;
  processedDate?: string | null;

  // Financial details
  bankDetails: BankDetails;
  fees: PaymentFees;
  breakdown: PaymentBreakdown;

  // Additional info
  documents?: string[];
  notes?: string;
  metadata?: Record<string, any>;
}

export interface PaymentStatus {
  label: string;
  value: string;
  color: string;
}

export interface PaymentType {
  label: string;
  value: string;
}

export interface PaymentPriority {
  label: string;
  value: string;
  color: string;
}

export interface ApprovalStatus {
  label: string;
  value: string;
  color: string;
}