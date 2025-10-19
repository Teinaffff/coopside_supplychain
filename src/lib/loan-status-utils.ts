import { LoanApplication } from "../services/loanApplicationService";

export interface ProcessedLoanApplication extends LoanApplication {
  displayPartnerStatus: "PENDING" | "APPROVED" | "REJECTED";
  displaySuperAdminStatus: "PENDING" | "APPROVED" | "REJECTED";
  shouldShowInTracking: boolean;
  trackingStatus: "DISBURSED" | "NOT_DISBURSED" | null;
  agentStatus: "PENDING" | "APPROVED" | "REJECTED";
}

/**
 * Processes loan application statuses according to business logic:
 * - PENDING_PARTNER_APPROVAL: Both statuses show as PENDING
 * - PENDING_SUPER_ADMIN_APPROVAL: Partner status shows APPROVED, Super Admin shows PENDING
 * - DISBURSED: Both statuses show as APPROVED, added to tracking with DISBURSED status
 * - APPROVED: Both statuses show as APPROVED, added to tracking with NOT_DISBURSED status
 * - REJECTED: Both statuses show as REJECTED
 */
export function processLoanApplicationStatus(application: LoanApplication): ProcessedLoanApplication {
  const { status, superAdminStatus, agentStatus } = application;
  
  console.log("=== STATUS PROCESSING DEBUG ===");
  console.log("Input status:", status, "Type:", typeof status);
  console.log("Input superAdminStatus:", superAdminStatus, "Type:", typeof superAdminStatus);
  console.log("Input agentStatus:", agentStatus, "Type:", typeof agentStatus);
  
  let displayPartnerStatus: "PENDING" | "APPROVED" | "REJECTED" = "PENDING";
  let displaySuperAdminStatus: "PENDING" | "APPROVED" | "REJECTED" = "PENDING";
  let shouldShowInTracking = false;
  let trackingStatus: "DISBURSED" | "NOT_DISBURSED" | null = null;
  let processedAgentStatus: "PENDING" | "APPROVED" | "REJECTED" = agentStatus || "PENDING";

  switch (status) {
    case "PENDING_PARTNER_APPROVAL":
      // Both statuses show as PENDING
      displayPartnerStatus = "PENDING";
      displaySuperAdminStatus = "PENDING";
      break;
      
    case "PENDING_SUPER_ADMIN_APPROVAL":
      // Partner status shows APPROVED, Super Admin shows PENDING
      displayPartnerStatus = "APPROVED";
      displaySuperAdminStatus = "PENDING";
      break;
      
    case "DISBURSED":
      // Both statuses show as APPROVED, add to tracking with DISBURSED status
      displayPartnerStatus = "APPROVED";
      displaySuperAdminStatus = "APPROVED";
      shouldShowInTracking = true;
      trackingStatus = "DISBURSED";
      break;
      
    case "APPROVED":
      // Both statuses show as APPROVED, add to tracking with NOT_DISBURSED status
      displayPartnerStatus = "APPROVED";
      displaySuperAdminStatus = "APPROVED";
      shouldShowInTracking = true;
      trackingStatus = "NOT_DISBURSED";
      break;
      
    case "REJECTED":
      // Both statuses show as REJECTED
      displayPartnerStatus = "REJECTED";
      displaySuperAdminStatus = "REJECTED";
      break;
      
    case "CANCELLED":
      // Both statuses show as REJECTED (cancelled is treated as rejected)
      displayPartnerStatus = "REJECTED";
      displaySuperAdminStatus = "REJECTED";
      break;
      
    case "DRAFT":
      // Both statuses show as PENDING
      displayPartnerStatus = "PENDING";
      displaySuperAdminStatus = "PENDING";
      break;
      
    default:
      // Default to PENDING for unknown statuses
      displayPartnerStatus = "PENDING";
      displaySuperAdminStatus = "PENDING";
      break;
  }

  // Additional logic: If superAdminStatus is "approved" and partner status is approved, 
  // then both should be approved and should show in tracking
  if (superAdminStatus === "approved" && displayPartnerStatus === "APPROVED") {
    displaySuperAdminStatus = "APPROVED";
    shouldShowInTracking = true;
    trackingStatus = status === "DISBURSED" ? "DISBURSED" : "NOT_DISBURSED";
  }

  // If superAdminStatus is "rejected", then super admin status should be rejected
  if (superAdminStatus === "rejected") {
    displaySuperAdminStatus = "REJECTED";
    shouldShowInTracking = false;
    trackingStatus = null;
  }

  const result = {
    ...application,
    displayPartnerStatus,
    displaySuperAdminStatus,
    shouldShowInTracking,
    trackingStatus,
    agentStatus: processedAgentStatus,
  };
  
  console.log("=== STATUS PROCESSING RESULT ===");
  console.log("Final displayPartnerStatus:", displayPartnerStatus);
  console.log("Final displaySuperAdminStatus:", displaySuperAdminStatus);
  console.log("Final shouldShowInTracking:", shouldShowInTracking);
  console.log("Final trackingStatus:", trackingStatus);
  console.log("Final agentStatus:", processedAgentStatus);
  
  return result;
}

/**
 * Processes an array of loan applications with status logic
 */
export function processLoanApplications(applications: LoanApplication[]): ProcessedLoanApplication[] {
  return applications.map(processLoanApplicationStatus);
}

/**
 * Filters applications that should be shown in loan status tracking
 */
export function getTrackingApplications(applications: ProcessedLoanApplication[]): ProcessedLoanApplication[] {
  return applications.filter(app => app.shouldShowInTracking);
}

/**
 * Gets status badge configuration for display
 */
export function getStatusBadgeConfig(status: "PENDING" | "APPROVED" | "REJECTED") {
  const configs = {
    PENDING: { 
      variant: "secondary" as const, 
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      icon: "Clock"
    },
    APPROVED: { 
      variant: "default" as const, 
      color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
      icon: "CheckCircle"
    },
    REJECTED: { 
      variant: "destructive" as const, 
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      icon: "XCircle"
    }
  };
  
  return configs[status];
}
