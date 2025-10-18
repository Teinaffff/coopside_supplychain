import { LoanProduct, LegacyLoanProduct } from '../constants/interface/coop/loan-product';

/**
 * Transform API loan product to legacy format for backward compatibility
 */
export const transformToLegacyFormat = (apiProduct: LoanProduct): LegacyLoanProduct => {
  return {
    id: apiProduct.id.toString(),
    productName: apiProduct.name,
    productCode: apiProduct.code,
    description: apiProduct.description,
    isActive: apiProduct.isActive,
    loanAmount: {
      minimum: apiProduct.minLoanAmount,
      maximum: apiProduct.maxLoanAmount,
      currency: 'ETB'
    },
    interestRate: {
      type: 'fixed',
      value: apiProduct.defaultInterestRate,
      calculationMethod: 'reducing_balance'
    },
    repaymentPeriod: {
      minimum: apiProduct.minRepaymentPeriodMonths,
      maximum: apiProduct.maxRepaymentPeriodMonths,
      default: apiProduct.defaultRepaymentPeriodMonths
    },
    installmentFrequency: 'monthly',
    eligibilityCriteria: {
      targetSegment: 'all',
      minimumMembershipMonths: 0,
      minimumAge: 18,
      requiredDocuments: apiProduct.requiredDocuments,
      creditScoreMinimum: apiProduct.minCreditScore
    },
    fees: {
      processingFee: {
        type: apiProduct.processingFeeType.toLowerCase() as 'percentage' | 'fixed',
        value: apiProduct.processingFeeValue
      },
      latePaymentFee: {
        type: 'percentage',
        value: apiProduct.latePaymentPenaltyRate
      },
      earlyRepaymentFee: apiProduct.prepaymentAllowed ? {
        type: 'percentage',
        value: apiProduct.prepaymentPenaltyRate
      } : undefined
    },
    riskManagement: {
      defaultRiskRules: {
        gracePeriod: 7,
        escalationPeriod: 30,
        writeOffPeriod: 90
      },
      collateralRequired: apiProduct.collateralRequired,
      guarantorRequired: apiProduct.guarantorRequired
    },
    disbursement: {
      method: 'bank_transfer',
      processingTime: 1,
      autoDisbursement: false
    },
    repayment: {
      channels: ['bank_transfer'],
      autoDeduction: false,
      gracePeriod: 3
    },
    termsAndConditions: {
      templateId: 'default',
      customTerms: apiProduct.termsAndConditions
    },
    settings: {
      allowEarlyRepayment: apiProduct.prepaymentAllowed,
      allowPartialRepayment: false,
      allowTopUp: false,
      requireApproval: apiProduct.requiresPartnerApproval || apiProduct.requiresAdminApproval,
      maxApplicationsPerUser: 1,
      coolingOffPeriod: 1
    },
    createdAt: apiProduct.createdAt,
    updatedAt: apiProduct.updatedAt
  };
};

/**
 * Transform legacy loan product to API format
 */
export const transformToApiFormat = (legacyProduct: LegacyLoanProduct): Partial<LoanProduct> => {
  return {
    code: legacyProduct.productCode,
    name: legacyProduct.productName,
    description: legacyProduct.description || '',
    defaultInterestRate: legacyProduct.interestRate.value,
    minInterestRate: legacyProduct.interestRate.value * 0.8, // Assume 20% below default
    maxInterestRate: legacyProduct.interestRate.value * 1.2, // Assume 20% above default
    defaultRepaymentPeriodMonths: legacyProduct.repaymentPeriod.default,
    minRepaymentPeriodMonths: legacyProduct.repaymentPeriod.minimum,
    maxRepaymentPeriodMonths: legacyProduct.repaymentPeriod.maximum,
    minLoanAmount: legacyProduct.loanAmount.minimum,
    maxLoanAmount: legacyProduct.loanAmount.maximum,
    processingFeeType: legacyProduct.fees.processingFee.type.toUpperCase() as 'PERCENTAGE' | 'FIXED',
    processingFeeValue: legacyProduct.fees.processingFee.value,
    minProcessingFee: legacyProduct.fees.processingFee.value * 0.1, // Assume 10% of fee value
    maxProcessingFee: legacyProduct.fees.processingFee.value * 10, // Assume 10x fee value
    latePaymentPenaltyRate: legacyProduct.fees.latePaymentFee.value,
    prepaymentAllowed: legacyProduct.settings.allowEarlyRepayment,
    prepaymentPenaltyRate: legacyProduct.fees.earlyRepaymentFee?.value || 0,
    collateralRequired: legacyProduct.riskManagement.collateralRequired,
    guarantorRequired: legacyProduct.riskManagement.guarantorRequired,
    minCreditScore: legacyProduct.eligibilityCriteria.creditScoreMinimum || 650,
    requiredDocuments: legacyProduct.eligibilityCriteria.requiredDocuments,
    requiresPartnerApproval: legacyProduct.settings.requireApproval,
    requiresAdminApproval: false,
    autoApproveThreshold: legacyProduct.loanAmount.maximum * 0.1, // Assume 10% of max amount
    minScoreForAutoApprove: 750,
    displayOrder: 1,
    additionalSettings: null,
    termsAndConditions: legacyProduct.termsAndConditions.customTerms || legacyProduct.termsAndConditions.templateId
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'ETB'): string => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format percentage for display
 */
export const formatPercentage = (value: number): string => {
  return `${value}%`;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Validate loan product form data
 */
export const validateLoanProductForm = (data: any): string[] => {
  const errors: string[] = [];

  if (!data.code || data.code.trim() === '') {
    errors.push('Product code is required');
  }

  if (!data.name || data.name.trim() === '') {
    errors.push('Product name is required');
  }

  if (!data.description || data.description.trim() === '') {
    errors.push('Description is required');
  }

  if (data.minLoanAmount >= data.maxLoanAmount) {
    errors.push('Minimum loan amount must be less than maximum loan amount');
  }

  if (data.minInterestRate >= data.maxInterestRate) {
    errors.push('Minimum interest rate must be less than maximum interest rate');
  }

  if (data.minRepaymentPeriodMonths >= data.maxRepaymentPeriodMonths) {
    errors.push('Minimum repayment period must be less than maximum repayment period');
  }

  if (data.defaultInterestRate < data.minInterestRate || data.defaultInterestRate > data.maxInterestRate) {
    errors.push('Default interest rate must be between minimum and maximum rates');
  }

  if (data.defaultRepaymentPeriodMonths < data.minRepaymentPeriodMonths || data.defaultRepaymentPeriodMonths > data.maxRepaymentPeriodMonths) {
    errors.push('Default repayment period must be between minimum and maximum periods');
  }

  if (data.minProcessingFee >= data.maxProcessingFee) {
    errors.push('Minimum processing fee must be less than maximum processing fee');
  }

  if (data.processingFeeValue < 0) {
    errors.push('Processing fee value cannot be negative');
  }

  if (data.latePaymentPenaltyRate < 0) {
    errors.push('Late payment penalty rate cannot be negative');
  }

  if (data.prepaymentPenaltyRate < 0) {
    errors.push('Prepayment penalty rate cannot be negative');
  }

  if (data.minCreditScore < 0 || data.minCreditScore > 1000) {
    errors.push('Minimum credit score must be between 0 and 1000');
  }

  if (data.autoApproveThreshold < 0) {
    errors.push('Auto approve threshold cannot be negative');
  }

  if (data.minScoreForAutoApprove < 0 || data.minScoreForAutoApprove > 1000) {
    errors.push('Minimum score for auto approve must be between 0 and 1000');
  }

  return errors;
};
