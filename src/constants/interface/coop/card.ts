interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface Card extends Timestamps {
  id: number;
  cardNumber: string;
  cardName: string;
  cardType: "CREDIT" | "DEBIT" | "PREPAID";
  cardStatus: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "INACTIVE" | "SUSPENDED";
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  creditLimit?: number;
  spentAmount?: number;
  availableBalance?: number;
  dailyLimit?: number;
  expiryMonth?: number;
  expiryYear?: number;
  issuedDate?: string;
  lastUsed?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  isExpired: boolean;
  isUsable: boolean;
  isApproved: boolean;
  // Legacy fields for backward compatibility
  type?: "CREDIT" | "DEBIT" | "PREPAID";
  status?: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "INACTIVE" | "SUSPENDED";
  partnerStatus?: "PARTNER" | "NON_PARTNER" | "PENDING_PARTNER";
  adminStatus?: "SUPER_ADMIN" | "ADMIN" | "USER";
  requestedDate?: string;
  expiryDate?: string;
  cardholderId?: string;
  cardholderName?: string;
  cardholderEmail?: string;
  cardholderPhone?: string;
  kycReference?: string;
  isActive?: boolean;
  lastTransactionDate?: string;
  totalTransactions?: number;
  monthlySpend?: number;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH";
  notes?: string;
}

export interface CardFilter {
  search?: string;
  cardStatus?: Card["cardStatus"][];
  cardType?: Card["cardType"][];
  approvalStatus?: Card["approvalStatus"][];
  partnerStatus?: Card["partnerStatus"][];
  adminStatus?: Card["adminStatus"][];
  dateRange?: {
    from: string;
    to: string;
  };
  creditLimitRange?: {
    min: number;
    max: number;
  };
  riskLevel?: Card["riskLevel"][];
  consumerId?: string;
}

export interface CardAction {
  id: string;
  label: string;
  action: "approve" | "reject" | "suspend" | "activate" | "view" | "edit" | "delete";
  icon?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  requiresConfirmation?: boolean;
}

export interface CardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  active: number;
  inactive: number;
  suspended: number;
  totalCreditLimit: number;
  totalAvailableBalance: number;
  monthlySpend: number;
  partnerCards: number;
  superAdminCards: number;
}
