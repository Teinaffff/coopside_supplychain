import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../config/axios-config";
import { toast } from "react-hot-toast";

export type EntityStatus = "Pending" | "Approved" | "Rejected";

interface InstitutionDoc {
  id: number;
  name: string;
  uploadedAt: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface Institution {
  id: number;
  name: string;
  type: "institution";
  status: "Pending" | "Approved" | "Rejected"; // Super Admin Status (this portal)
  adminStatus: "Pending" | "Approved" | "Rejected"; // Admin Status (external portal)
  docs: InstitutionDoc[];
  form: Record<string, any>;
}

const fetchInstitutions = async (): Promise<Institution[]> => {
  try {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No authentication token found. Please login again.");
    }

      const response = await API.get("/v1/institutions");
    const data = response.data;

      if (data?.success && Array.isArray(data.data)) {
        const statusMap: Record<string, EntityStatus> = {
          APPROVED: "Approved",
          PENDING: "Pending",
          REJECTED_BY_ADMIN: "Rejected",
          REJECTED: "Rejected",
        };

      return data.data.map((i: any) => ({
          id: i.id,
          name: i.fullLegalName || i.username || `Institution ${i.id}`,
          type: "institution" as const,
          status: statusMap[i.superAdminApprovalStatus] || "Pending", // Super Admin Status (this portal)
          adminStatus: statusMap[i.adminApprovalStatus] || "Pending", // Admin Status (external portal)
          docs: [],
        form: {
          ...i,
          phone: i.contactPhone || i.phone || i.phoneNumber || "",
          email: i.contactEmail || i.email || i.emailAddress || "",
          tin: i.tin || i.taxId || "",
        },
      }));
    }
    
    return [];
  } catch (error: any) {
    console.error("[INSTITUTIONS API ERROR]", error);
    
    // Handle specific authentication errors
    if (error?.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    } else if (error?.response?.status === 403) {
      throw new Error("You don't have permission to access institutions data.");
    } else if (error?.message?.includes("No authentication token")) {
      throw error; // Re-throw authentication token errors
    }
    
    throw error;
  }
};

// Approve institution function
const approveInstitution = async (institutionId: number): Promise<void> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No authentication token found. Please login again.");
    }

    const response = await API.post(`/v1/institutions/${institutionId}/approve`);
    
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to approve institution");
    }
    
    return response.data;
  } catch (error: any) {
    console.error("[APPROVE INSTITUTION ERROR]", error);
    
    if (error?.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    } else if (error?.response?.status === 403) {
      throw new Error("You don't have permission to approve institutions.");
    } else if (error?.response?.status === 404) {
      throw new Error("Institution not found.");
    } else if (error?.response?.status === 400) {
      throw new Error(error?.response?.data?.message || "Invalid request. Please check the institution data.");
    }
    
    throw error;
  }
};

// Reject institution function
const rejectInstitution = async (institutionId: number, reason: string): Promise<void> => {
  try {
    console.log("[REJECT INSTITUTION] Input - institutionId:", institutionId, "Type:", typeof institutionId, "Reason:", reason);
    
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No authentication token found. Please login again.");
    }

    // Validate institutionId is a number
    if (typeof institutionId !== 'number' || isNaN(institutionId)) {
      throw new Error(`Invalid institution ID: ${institutionId} (type: ${typeof institutionId})`);
    }

    // Encode the reason for URL query parameter
    const encodedReason = encodeURIComponent(reason);
    const url = `/v1/institutions/${institutionId}/reject?reason=${encodedReason}`;
    console.log("[REJECT INSTITUTION] URL:", url);
    
    const response = await API.post(url);
    
    console.log("[REJECT INSTITUTION] Response:", response.status, response.data);
    
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to reject institution");
    }
    
    return response.data;
  } catch (error: any) {
    console.error("[REJECT INSTITUTION ERROR]", error);
    
    if (error?.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    } else if (error?.response?.status === 403) {
      throw new Error("You don't have permission to reject institutions.");
    } else if (error?.response?.status === 404) {
      throw new Error("Institution not found.");
    } else if (error?.response?.status === 400) {
      throw new Error(error?.response?.data?.message || "Invalid request. Please check the institution data.");
    }
    
    throw error;
  }
};

export const useInstitutions = (isFetchInstitutions?: boolean) => {
  const queryClient = useQueryClient();
  
  const {
    data: institutions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["institutions"],
    queryFn: fetchInstitutions,
    enabled: isFetchInstitutions !== false, // Default to true if not specified
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Approve institution mutation
  const approveInstitutionMutation = useMutation({
    mutationFn: (institutionId: number) => approveInstitution(institutionId),
    onSuccess: () => {
      // Invalidate and refetch institutions data
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      toast.success("Institution approved successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to approve institution";
      toast.error(errorMessage);
    },
  });

  // Reject institution mutation
  const rejectInstitutionMutation = useMutation({
    mutationFn: ({ institutionId, reason }: { institutionId: number; reason: string }) => 
      rejectInstitution(institutionId, reason),
    onSuccess: () => {
      // Invalidate and refetch institutions data
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      toast.success("Institution rejected successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to reject institution";
      toast.error(errorMessage);
    },
  });

  return {
    institutions,
    isLoading,
    error,
    refetch,
    approveInstitution: approveInstitutionMutation.mutate,
    rejectInstitution: rejectInstitutionMutation.mutate,
    isApproving: approveInstitutionMutation.isPending,
    isRejecting: rejectInstitutionMutation.isPending,
  };
};