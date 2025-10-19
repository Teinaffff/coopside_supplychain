interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface Card extends Timestamps {
  id: string;
  cardNumber: string;
  cardName: string;
  type: "CREDIT" | "DEBIT" | "PREPAID";
  creditLimit?: number;
  dailyLimit?: number;
  availableBalance?: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "INACTIVE" | "SUSPENDED";
  partnerStatus: "PARTNER" | "NON_PARTNER" | "PENDING_PARTNER";
  adminStatus: "SUPER_ADMIN" | "ADMIN" | "USER";
  rejectionReason?: string;
  requestedDate: string;
  issuedDate?: string;
  expiryDate?: string;
  cardholderId: string;
  cardholderName: string;
  cardholderEmail?: string;
  cardholderPhone?: string;
  kycReference?: string;
  isActive: boolean;
  lastTransactionDate?: string;
  totalTransactions?: number;
  monthlySpend?: number;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH";
  notes?: string;
}

export interface CardFilter {
  search?: string;
  status?: Card["status"][];
  type?: Card["type"][];
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
