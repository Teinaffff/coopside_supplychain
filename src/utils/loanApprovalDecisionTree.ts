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
 * Decision Rules:
 * - LOW RISK (75-100): Auto-approve, 100% of request
 * - MEDIUM RISK (50-74): Approve with conditions, 60-80% of request
 * - HIGH RISK (0-49): Reject or require collateral, ≤ 40% of request
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
  if (calculatedRiskLevel === "LOW") {
    // LOW RISK: 75-100 credit score
    // Auto-approve, 100% of request
    decision = "APPROVE";
    approvedAmount = loanAmountRequested;
    percentageApproved = 100;
    reason = `Auto-approved: Excellent credit score (${creditScore}). Low risk borrower qualifies for full requested amount.`;
  } else if (calculatedRiskLevel === "MEDIUM") {
    // MEDIUM RISK: 50-74 credit score
    // Approve with conditions, 60-80% of request
    // Calculate percentage based on credit score within the 50-74 range
    // Higher scores (closer to 74) get closer to 80%, lower scores (closer to 50) get closer to 60%
    const scoreRange = creditScore - 50; // 0-24
    const percentageRange = 0.20; // 20% range (60% to 80%)
    percentageApproved = 60 + (scoreRange / 24) * percentageRange * 100;
    percentageApproved = Math.round(percentageApproved); // Round to nearest integer
    
    approvedAmount = Math.round((loanAmountRequested * percentageApproved) / 100);
    decision = "APPROVE_WITH_CONDITIONS";
    reason = `Approved with conditions: Medium risk credit score (${creditScore}). Approved ${percentageApproved}% of requested amount. Additional documentation or collateral may be required.`;
  } else {
    // HIGH RISK: 0-49 credit score
    // Reject or require collateral, ≤ 40% of request
    // Calculate percentage based on credit score within the 0-49 range
    // Higher scores (closer to 49) get closer to 40%, lower scores (closer to 0) get closer to 0%
    if (creditScore >= 30) {
      // Scores 30-49: Approve with conditions, 20-40% of request
      const scoreRange = creditScore - 30; // 0-19
      const percentageRange = 0.20; // 20% range (20% to 40%)
      percentageApproved = 20 + (scoreRange / 19) * percentageRange * 100;
      percentageApproved = Math.round(percentageApproved);
      approvedAmount = Math.round((loanAmountRequested * percentageApproved) / 100);
      decision = "APPROVE_WITH_CONDITIONS";
      reason = `Approved with strict conditions: High risk credit score (${creditScore}). Approved ${percentageApproved}% of requested amount. Collateral and guarantor required.`;
    } else {
      // Scores 0-29: Reject
      decision = "REJECT";
      approvedAmount = 0;
      percentageApproved = 0;
      reason = `Rejected: Very high risk credit score (${creditScore}). Does not meet minimum credit requirements.`;
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

