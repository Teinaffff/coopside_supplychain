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
 * - PENDING_PARTNER_APPROVAL: Both statuses show as PENDING, NOT in tracking (stays in loan requests)
 * - PENDING_SUPER_ADMIN_APPROVAL: Partner status shows APPROVED, Super Admin shows PENDING, NOT in tracking
 * - PENDING_AGENT_CONFIRMATION: Super Admin APPROVED, Agent PENDING, IN tracking (super admin approved, waiting for agent)
 * - DISBURSED: Both statuses show as APPROVED, added to tracking with DISBURSED status
 * - APPROVED: Both statuses show as APPROVED, added to tracking with NOT_DISBURSED status
 * - REJECTED: Status depends on who rejected:
 *   - If Super Admin rejected (superAdminStatus="rejected"): Super Admin shows REJECTED, Partner status preserved (if partner approved, stays APPROVED)
 *   - If Partner rejected: Partner shows REJECTED, Super Admin shows PENDING
 * - Super Admin rejection does NOT override partner approval status - it only affects superAdminStatus
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

  // Normalize status and agentStatus to uppercase for consistent comparison
  const normalizedStatus = (status || '').toUpperCase();
  const normalizedAgentStatus = agentStatus ? (agentStatus.toUpperCase() as "PENDING" | "APPROVED" | "REJECTED") : undefined;
  
  // CRITICAL: Partner status is determined by agentStatus (partner's actual decision)
  // Super Admin's rejection should NEVER change partner status - it only affects superAdminStatus
  // Partner can be APPROVED or REJECTED independently, and that status should be preserved
  const isSuperAdminRejected = superAdminStatus?.toLowerCase() === "rejected";
  
  // Use agentStatus as the primary source of truth for partner status
  // agentStatus represents the actual partner/agent decision from the API
  if (normalizedAgentStatus) {
    // agentStatus is available - use it directly (APPROVED, REJECTED, or PENDING)
    // Super Admin's rejection does not affect this - partner status is independent
    displayPartnerStatus = normalizedAgentStatus === "REJECTED" ? "REJECTED" : 
                          normalizedAgentStatus === "APPROVED" ? "APPROVED" : "PENDING";
  } else {
    // Fallback to deriving from main status if agentStatus is not available
    // CRITICAL: Super Admin rejection should NOT affect partner status inference
    // Partner status should be determined independently based on status indicators
    
    // Check for explicit partner rejection indicators first
    if (normalizedStatus.includes("PARTNER_REJECTED") || 
        normalizedStatus.includes("REJECTED_BY_PARTNER")) {
      // Explicit partner rejection - partner status is REJECTED
      displayPartnerStatus = "REJECTED";
    } else if (normalizedStatus === "PENDING_PARTNER_APPROVAL" || normalizedStatus === "DRAFT") {
      // Partner hasn't made a decision yet
      displayPartnerStatus = "PENDING";
    } else if (normalizedStatus === "PENDING_SUPER_ADMIN_APPROVAL" ||
               normalizedStatus === "APPROVED" ||
               normalizedStatus === "DISBURSED") {
      // These statuses indicate partner has approved (loan reached Super Admin or beyond)
      displayPartnerStatus = "APPROVED";
    } else if (normalizedStatus.includes("REJECTED") || normalizedStatus === "CANCELLED") {
      // Generic REJECTED status - need to determine if it's partner or super admin rejection
      // CRITICAL: If Super Admin rejected, don't assume partner also rejected
      // Check status string for clues about who rejected
      if (normalizedStatus.includes("SUPER_ADMIN") || normalizedStatus.includes("BY_SUPER_ADMIN")) {
        // Status explicitly indicates Super Admin rejection
        // Partner status is unclear from status alone, but if it got to Super Admin, partner likely approved
        // However, we should default to PENDING rather than assuming APPROVED
        // The backend should provide agentStatus, but if missing, default to PENDING
        displayPartnerStatus = "PENDING";
      } else if (!isSuperAdminRejected) {
        // Not Super Admin rejection and no explicit indicator - likely partner rejection
        displayPartnerStatus = "REJECTED";
      } else {
        // Super Admin rejected but status doesn't clearly indicate partner status
        // Without agentStatus, we can't be sure - default to PENDING
        displayPartnerStatus = "PENDING";
      }
    } else {
      // Unknown status - default to PENDING
      displayPartnerStatus = "PENDING";
    }
  }

  // Determine super admin status based on status and superAdminStatus field
  // IMPORTANT: Check PENDING_AGENT_CONFIRMATION first - this means super admin approved, waiting for agent
  if (normalizedStatus === "PENDING_AGENT_CONFIRMATION" || normalizedStatus.includes("PENDING_AGENT")) {
    // PENDING_AGENT_CONFIRMATION means super admin has approved, waiting for agent confirmation
    displaySuperAdminStatus = "APPROVED";
    shouldShowInTracking = true; // Should appear in Loan Status Tracking (NOT in Loan Requests)
    trackingStatus = "NOT_DISBURSED";
    // Agent status is pending (waiting for agent to confirm)
    processedAgentStatus = "PENDING";
    displayPartnerStatus = "PENDING"; // Agent/Partner status shows as PENDING in tracking
  } else if (normalizedStatus === "PENDING_PARTNER_APPROVAL" || normalizedStatus === "DRAFT") {
    displaySuperAdminStatus = "PENDING";
    shouldShowInTracking = false; // NOT in tracking - waiting for partner approval, stays in loan requests
  } else if (normalizedStatus === "PENDING_SUPER_ADMIN_APPROVAL") {
    displaySuperAdminStatus = "PENDING";
    shouldShowInTracking = false; // NOT in tracking - waiting for super admin approval, stays in loan requests
  } else if (normalizedStatus === "DISBURSED") {
    displaySuperAdminStatus = "APPROVED";
    shouldShowInTracking = true;
    trackingStatus = "DISBURSED";
  } else if (normalizedStatus === "APPROVED") {
    displaySuperAdminStatus = "APPROVED";
    shouldShowInTracking = true;
    trackingStatus = "NOT_DISBURSED";
  } else if (normalizedStatus.includes("REJECTED") || normalizedStatus === "CANCELLED") {
    // Check if this is a Super Admin rejection vs Partner rejection
    // IMPORTANT: Super Admin rejection should NOT affect partner status
    if (superAdminStatus?.toLowerCase() === "rejected") {
      // Super Admin has rejected - only update super admin status, preserve partner status
      displaySuperAdminStatus = "REJECTED";
      // Partner status should remain unchanged (already set above based on agentStatus)
      // Do NOT override displayPartnerStatus here
    } else if (displayPartnerStatus === "REJECTED" && !normalizedStatus.includes("SUPER_ADMIN")) {
      // If partner rejected but super admin hasn't acted, super admin is still pending
      displaySuperAdminStatus = "PENDING";
    } else if (normalizedStatus.includes("PARTNER_REJECTED") || normalizedStatus.includes("REJECTED_BY_PARTNER")) {
      // Partner rejection - partner status is already REJECTED, super admin is pending
      displaySuperAdminStatus = "PENDING";
    } else {
      // Generic REJECTED status - check if we can determine from other fields
      // If superAdminStatus is not rejected, assume it's a partner rejection or pending
      if (!superAdminStatus || superAdminStatus.toLowerCase() !== "rejected") {
        displaySuperAdminStatus = displayPartnerStatus === "REJECTED" ? "PENDING" : "REJECTED";
      } else {
        displaySuperAdminStatus = "REJECTED";
      }
    }
  } else {
    displaySuperAdminStatus = "PENDING";
  }

  // Additional logic: If superAdminStatus is "approved", then super admin has approved
  // This should show in tracking even if agent status is still pending (PENDING_AGENT_CONFIRMATION case)
  if (superAdminStatus === "approved") {
    displaySuperAdminStatus = "APPROVED";
    // Add to tracking if not already set (handles cases where super admin approved but agent still pending)
    if (!shouldShowInTracking && !normalizedStatus.includes("PENDING_PARTNER") && !normalizedStatus.includes("PENDING_SUPER_ADMIN")) {
      shouldShowInTracking = true;
      trackingStatus = normalizedStatus === "DISBURSED" ? "DISBURSED" : "NOT_DISBURSED";
    }
  }

  // CRITICAL FIX: If superAdminStatus is "rejected", then super admin status should be rejected
  // BUT partner status should remain unchanged (preserve partner approval if it exists)
  // This ensures that when Super Admin rejects, partner's approval status is preserved
  if (superAdminStatus === "rejected") {
    displaySuperAdminStatus = "REJECTED";
    shouldShowInTracking = false;
    trackingStatus = null;
    // IMPORTANT: Do NOT modify displayPartnerStatus here - it should remain as determined above
    // This ensures that if partner approved the loan, that approval status stays visible
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
