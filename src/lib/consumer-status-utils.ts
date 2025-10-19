export type ConsumerStatus = "Pending" | "Approved" | "Rejected";

export interface ConsumerStatusMapping {
  adminStatus: ConsumerStatus; // Partner status
  status: ConsumerStatus; // Super Admin status
}

/**
 * Maps consumer status fields from API response to standardized status values
 * Similar to the institution status mapping pattern
 */
export function mapConsumerStatus(consumerData: any): ConsumerStatusMapping {
  // Status mapping object similar to institution mapping
  const statusMap: Record<string, ConsumerStatus> = {
    APPROVED: "Approved",
    PENDING: "Pending", 
    REJECTED: "Rejected",
    REJECTED_BY_ADMIN: "Rejected",
    // Handle case variations
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
    "Approved": "Approved",
    "Pending": "Pending", 
    "Rejected": "Rejected"
  };

  // Map partner status (adminStatus) - check multiple possible field names in priority order
  let mappedAdminStatus: ConsumerStatus = "Pending";
  
  // Priority order for partner status fields
  const partnerStatusFields = [
    'adminApprovalStatus',
    'approvalStatus', 
    'partnerStatus',
    'coopAdminStatus',
    'adminStatus'
  ];

  for (const field of partnerStatusFields) {
    if (consumerData[field]) {
      mappedAdminStatus = statusMap[consumerData[field]] || "Pending";
      break;
    }
  }

  // Map super admin status - check multiple possible field names in priority order
  let mappedStatus: ConsumerStatus = "Pending";
  
  // Priority order for super admin status fields
  const superAdminStatusFields = [
    'superAdminApprovalStatus',
    'superAdminStatus',
    'bankApprovalStatus', 
    'status'
  ];

  for (const field of superAdminStatusFields) {
    if (consumerData[field]) {
      mappedStatus = statusMap[consumerData[field]] || "Pending";
      break;
    }
  }

  console.log("[CONSUMER STATUS MAPPING] Input data:", {
    rawData: consumerData,
    partnerStatusFields: partnerStatusFields.map(field => ({ field, value: consumerData[field] })),
    superAdminStatusFields: superAdminStatusFields.map(field => ({ field, value: consumerData[field] }))
  });

  console.log("[CONSUMER STATUS MAPPING] Mapped result:", {
    mappedAdminStatus,
    mappedStatus
  });

  return {
    adminStatus: mappedAdminStatus,
    status: mappedStatus
  };
}

/**
 * Maps a single status value using the status map
 */
export function mapSingleStatus(statusValue: string | undefined): ConsumerStatus {
  const statusMap: Record<string, ConsumerStatus> = {
    APPROVED: "Approved",
    PENDING: "Pending", 
    REJECTED: "Rejected",
    REJECTED_BY_ADMIN: "Rejected",
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
    "Approved": "Approved",
    "Pending": "Pending", 
    "Rejected": "Rejected"
  };

  return statusMap[statusValue || ''] || "Pending";
}
