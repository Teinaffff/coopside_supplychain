interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface LoanProduct extends Timestamps {
  id: string;
  productName: string;
  productCode: string;
  description?: string;
  isActive: boolean;
  
  // Loan Terms
  loanAmount: {
    minimum: number;
    maximum: number;
    currency: string;
  };
  
  // Interest Rate Configuration
  interestRate: {
    type: 'fixed' | 'variable' | 'tiered';
    value: number; // For fixed rate
    tiers?: InterestRateTier[]; // For tiered rates
    calculationMethod: 'simple' | 'compound' | 'reducing_balance';
    compoundingFrequency?: 'monthly' | 'quarterly' | 'annually';
  };
  
  // Repayment Terms
  repaymentPeriod: {
    minimum: number; // in months
    maximum: number; // in months
    default: number; // in months
  };
  
  installmentFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  
  // Eligibility Criteria
  eligibilityCriteria: {
    targetSegment: 'consumers' | 'agents' | 'sellers' | 'institutions' | 'all';
    minimumMembershipMonths: number;
    minimumAge: number;
    maximumAge?: number;
    minimumIncome?: number;
    requiredDocuments: string[];
    creditScoreMinimum?: number;
  };
  
  // Fees and Charges
  fees: {
    processingFee: {
      type: 'percentage' | 'fixed';
      value: number;
    };
    latePaymentFee: {
      type: 'percentage' | 'fixed';
      value: number;
    };
    earlyRepaymentFee?: {
      type: 'percentage' | 'fixed';
      value: number;
    };
    disbursementFee?: {
      type: 'percentage' | 'fixed';
      value: number;
    };
  };
  
  // Risk Management
  riskManagement: {
    defaultRiskRules: {
      gracePeriod: number; // in days
      escalationPeriod: number; // in days
      writeOffPeriod: number; // in days
    };
    maximumLoanToValueRatio?: number; // For secured loans
    maximumDebtToIncomeRatio?: number;
    collateralRequired: boolean;
    guarantorRequired: boolean;
  };
  
  // Disbursement and Repayment
  disbursement: {
    method: 'wallet' | 'bank_transfer' | 'cash' | 'mobile_money';
    processingTime: number; // in days
    autoDisbursement: boolean;
  };
  
  repayment: {
    channels: ('salary_deduction' | 'bank_transfer' | 'mobile_money' | 'cash' | 'wallet')[];
    autoDeduction: boolean;
    gracePeriod: number; // in days
  };
  
  // Terms and Conditions
  termsAndConditions: {
    templateId: string;
    customTerms?: string;
  };
  
  // Additional Settings
  settings: {
    allowEarlyRepayment: boolean;
    allowPartialRepayment: boolean;
    allowTopUp: boolean;
    requireApproval: boolean;
    maxApplicationsPerUser: number;
    coolingOffPeriod: number; // in days
  };
}

export interface InterestRateTier {
  minAmount: number;
  maxAmount?: number;
  rate: number;
  description?: string;
}

export interface LoanProductFormData {
  productName: string;
  productCode: string;
  description: string;
  isActive: boolean;
  loanAmountMin: number;
  loanAmountMax: number;
  currency: string;
  interestRateType: 'fixed' | 'variable' | 'tiered';
  interestRateValue: number;
  interestRateCalculationMethod: 'simple' | 'compound' | 'reducing_balance';
  compoundingFrequency: 'monthly' | 'quarterly' | 'annually';
  repaymentPeriodMin: number;
  repaymentPeriodMax: number;
  repaymentPeriodDefault: number;
  installmentFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  targetSegment: 'consumers' | 'agents' | 'sellers' | 'institutions' | 'all';
  minimumMembershipMonths: number;
  minimumAge: number;
  maximumAge?: number;
  minimumIncome?: number;
  requiredDocuments: string[];
  creditScoreMinimum?: number;
  processingFeeType: 'percentage' | 'fixed';
  processingFeeValue: number;
  latePaymentFeeType: 'percentage' | 'fixed';
  latePaymentFeeValue: number;
  earlyRepaymentFeeType?: 'percentage' | 'fixed';
  earlyRepaymentFeeValue?: number;
  disbursementFeeType?: 'percentage' | 'fixed';
  disbursementFeeValue?: number;
  gracePeriod: number;
  escalationPeriod: number;
  writeOffPeriod: number;
  maximumLoanToValueRatio?: number;
  maximumDebtToIncomeRatio?: number;
  collateralRequired: boolean;
  guarantorRequired: boolean;
}
