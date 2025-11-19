export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type ApprovalDecision = "APPROVE" | "APPROVE_WITH_CONDITIONS" | "REJECT";

export interface LoanApprovalDecision {
  decision: ApprovalDecision;
  approvedAmount: number;
  reason: string;
  creditScore: number;
  riskLevel: RiskLevel;
  requestedAmount: number;
  percentageApproved: number;
}

/**
 * Loan Approval Decision Tree
 * 
 * Decision Rules based on Credit Score and Requested Loan Amount:
 * 
 * 1. High Credit Score (75-100):
 *    - ≤ 50,000: 100% approve
 *    - 50,001 – 100,000: 80% approve
 *    - 100,001 – 200,000: 60% approve
 *    - > 200,000: Manual review (40%)
 * 
 * 2. Medium Credit Score (50-74):
 *    - ≤ 30,000: 70% approve
 *    - 30,001 – 50,000: 50% approve
 *    - 50,001 – 100,000: 30% approve
 *    - > 100,000: Manual review (20%)
 * 
 * 3. Low Credit Score (30-49):
 *    - ≤ 20,000: 40% approve
 *    - 20,001 – 40,000: 25% approve
 *    - > 40,000: Reject
 * 
 * 4. Very Low Credit Score (0-29):
 *    - ≤ 10,000: 10% approve (or collateral required)
 *    - > 10,000: Reject
 */
export function calculateLoanApproval(
  creditScore: number,
  riskLevel: RiskLevel,
  loanAmountRequested: number
): LoanApprovalDecision {
  // Validate inputs
  if (creditScore < 0 || creditScore > 100) {
    throw new Error("Credit score must be between 0 and 100");
  }

  if (loanAmountRequested <= 0) {
    throw new Error("Loan amount requested must be greater than 0");
  }

  // Determine risk level if not provided (based on credit score)
  const calculatedRiskLevel: RiskLevel = riskLevel || 
    (creditScore >= 75 ? "LOW" : creditScore >= 50 ? "MEDIUM" : "HIGH");

  let decision: ApprovalDecision;
  let approvedAmount: number;
  let reason: string;
  let percentageApproved: number;

  // Decision Tree Logic
  if (creditScore >= 75) {
    // High Credit Score (75-100)
    if (loanAmountRequested <= 50000) {
      percentageApproved = 100;
      decision = "APPROVE";
      reason = `Auto-approved: Excellent credit score (${creditScore}). Low risk borrower qualifies for full requested amount (ETB ${loanAmountRequested.toLocaleString()}).`;
    } else if (loanAmountRequested <= 100000) {
      percentageApproved = 80;
      decision = "APPROVE";
      reason = `Approved: Excellent credit score (${creditScore}). Approved 80% of requested amount (ETB ${loanAmountRequested.toLocaleString()}).`;
    } else if (loanAmountRequested <= 200000) {
      percentageApproved = 60;
      decision = "APPROVE_WITH_CONDITIONS";
      reason = `Approved with conditions: Excellent credit score (${creditScore}). Approved 60% of requested amount (ETB ${loanAmountRequested.toLocaleString()}). Additional documentation may be required.`;
    } else {
      // > 200,000: Manual review (40%)
      percentageApproved = 40;
      decision = "APPROVE_WITH_CONDITIONS";
      reason = `Manual review required: Excellent credit score (${creditScore}) but high loan amount (ETB ${loanAmountRequested.toLocaleString()}). Recommended approval: 40% of requested amount.`;
    }
    approvedAmount = Math.round((loanAmountRequested * percentageApproved) / 100);
  } else if (creditScore >= 50) {
    // Medium Credit Score (50-74)
    if (loanAmountRequested <= 30000) {
      percentageApproved = 70;
      decision = "APPROVE_WITH_CONDITIONS";
      reason = `Approved with conditions: Medium risk credit score (${creditScore}). Approved 70% of requested amount (ETB ${loanAmountRequested.toLocaleString()}). Additional documentation or collateral may be required.`;
    } else if (loanAmountRequested <= 50000) {
      percentageApproved = 50;
      decision = "APPROVE_WITH_CONDITIONS";
      reason = `Approved with conditions: Medium risk credit score (${creditScore}). Approved 50% of requested amount (ETB ${loanAmountRequested.toLocaleString()}). Additional documentation or collateral may be required.`;
    } else if (loanAmountRequested <= 100000) {
      percentageApproved = 30;
      decision = "APPROVE_WITH_CONDITIONS";
      reason = `Approved with conditions: Medium risk credit score (${creditScore}). Approved 30% of requested amount (ETB ${loanAmountRequested.toLocaleString()}). Additional documentation or collateral required.`;
    } else {
      // > 100,000: Manual review (20%)
      percentageApproved = 20;
      decision = "APPROVE_WITH_CONDITIONS";
      reason = `Manual review required: Medium risk credit score (${creditScore}) with high loan amount (ETB ${loanAmountRequested.toLocaleString()}). Recommended approval: 20% of requested amount.`;
    }
    approvedAmount = Math.round((loanAmountRequested * percentageApproved) / 100);
  } else if (creditScore >= 30) {
    // Low Credit Score (30-49)
    if (loanAmountRequested <= 20000) {
      percentageApproved = 40;
      decision = "APPROVE_WITH_CONDITIONS";
      approvedAmount = Math.round((loanAmountRequested * percentageApproved) / 100);
      reason = `Approved with strict conditions: High risk credit score (${creditScore}). Approved 40% of requested amount (ETB ${loanAmountRequested.toLocaleString()}). Collateral and guarantor required.`;
    } else if (loanAmountRequested <= 40000) {
      percentageApproved = 25;
      decision = "APPROVE_WITH_CONDITIONS";
      approvedAmount = Math.round((loanAmountRequested * percentageApproved) / 100);
      reason = `Approved with strict conditions: High risk credit score (${creditScore}). Approved 25% of requested amount (ETB ${loanAmountRequested.toLocaleString()}). Collateral and guarantor required.`;
    } else {
      // > 40,000: Reject
      decision = "REJECT";
      approvedAmount = 0;
      percentageApproved = 0;
      reason = `Rejected: High risk credit score (${creditScore}) and loan amount (ETB ${loanAmountRequested.toLocaleString()}) exceeds maximum limit for this risk category.`;
    }
  } else {
    // Very Low Credit Score (0-29)
    if (loanAmountRequested <= 10000) {
      percentageApproved = 10;
      decision = "APPROVE_WITH_CONDITIONS";
      approvedAmount = Math.round((loanAmountRequested * percentageApproved) / 100);
      reason = `Approved with strict conditions: Very high risk credit score (${creditScore}). Approved 10% of requested amount (ETB ${loanAmountRequested.toLocaleString()}). Collateral required.`;
    } else {
      // > 10,000: Reject
      decision = "REJECT";
      approvedAmount = 0;
      percentageApproved = 0;
      reason = `Rejected: Very high risk credit score (${creditScore}) and loan amount (ETB ${loanAmountRequested.toLocaleString()}) exceeds maximum limit. Does not meet minimum credit requirements.`;
    }
  }

  return {
    decision,
    approvedAmount,
    reason,
    creditScore,
    riskLevel: calculatedRiskLevel,
    requestedAmount: loanAmountRequested,
    percentageApproved,
  };
}

/**
 * Get risk level badge color for UI
 */
export function getRiskLevelColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case "LOW":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "HIGH":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}

/**
 * Get decision badge color for UI
 */
export function getDecisionColor(decision: ApprovalDecision): string {
  switch (decision) {
    case "APPROVE":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400";
    case "APPROVE_WITH_CONDITIONS":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "REJECT":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}

