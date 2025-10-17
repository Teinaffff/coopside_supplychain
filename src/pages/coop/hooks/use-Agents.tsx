import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../config/axios-config";
import { toast } from "react-hot-toast";

export type EntityStatus = "Pending" | "Approved" | "Rejected";

interface AgentDoc {
  id: number;
  name: string;
  uploadedAt: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface Agent {
  id: number;
  name: string;
  type: "agent";
  status: "Pending" | "Approved" | "Rejected"; // Super Admin Status (this portal)
  adminStatus: "Pending" | "Approved" | "Rejected"; // Admin Status (external portal)
  docs: AgentDoc[];
  form: Record<string, any>;
}

const fetchAgents = async (): Promise<Agent[]> => {
  try {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No authentication token found. Please login again.");
    }

    const response = await API.get("/v1/agents");
    const data = response.data;

    if (data?.success && Array.isArray(data.data)) {
      const statusMap: Record<string, EntityStatus> = {
        APPROVED: "Approved",
        PENDING: "Pending",
        REJECTED_BY_ADMIN: "Rejected",
        REJECTED: "Rejected",
      };

      return data.data.map((a: any) => ({
        id: a.id,
        name: a.fullLegalName || a.fullName || a.username || `Agent ${a.id}`,
        type: "agent" as const,
        status: statusMap[a.superAdminApprovalStatus] || "Pending", // Super Admin Status (this portal)
        adminStatus: statusMap[a.adminApprovalStatus] || "Pending", // Admin Status (external portal)
        docs: [], // you can populate if API provides docs
        form: {
          ...a,
          phone: a.phone || a.phoneNumber || a.contactPhone || "",
          email: a.email || a.emailAddress || a.contactEmail || "",
          tin: a.tin || a.taxId || "",
        },
      }));
    }
    
    return [];
  } catch (error: any) {
    console.error("[AGENTS API ERROR]", error);
    
    // Handle specific authentication errors
    if (error?.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    } else if (error?.response?.status === 403) {
      throw new Error("You don't have permission to access agents data.");
    } else if (error?.message?.includes("No authentication token")) {
      throw error; // Re-throw authentication token errors
    }
    
    throw error;
  }
};

// Approve agent function
const approveAgent = async (agentId: number): Promise<void> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No authentication token found. Please login again.");
    }

    const response = await API.post(`/v1/agents/${agentId}/approve`);
    
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to approve agent");
    }
    
    return response.data;
  } catch (error: any) {
    console.error("[APPROVE AGENT ERROR]", error);
    
    if (error?.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    } else if (error?.response?.status === 403) {
      throw new Error("You don't have permission to approve agents.");
    } else if (error?.response?.status === 404) {
      throw new Error("Agent not found.");
    } else if (error?.response?.status === 400) {
      throw new Error(error?.response?.data?.message || "Invalid request. Please check the agent data.");
    }
    
    throw error;
  }
};

// Reject agent function
const rejectAgent = async (agentId: number, reason: string): Promise<void> => {
  try {
    console.log("[REJECT AGENT] Input - agentId:", agentId, "Type:", typeof agentId, "Reason:", reason);
    
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No authentication token found. Please login again.");
    }

    // Validate agentId is a number
    if (typeof agentId !== 'number' || isNaN(agentId)) {
      throw new Error(`Invalid agent ID: ${agentId} (type: ${typeof agentId})`);
    }

    // Validate reason is not empty
    if (!reason || reason.trim() === '') {
      throw new Error("Rejection reason is required");
    }

    // Send reason in request body (backend expects @RequestBody)
    const url = `/v1/agents/${agentId}/reject`;
    const requestData = { reason: reason.trim() };
    console.log("[REJECT AGENT] URL:", url, "Data:", requestData);
    
    const response = await API.post(url, requestData);
    
    console.log("[REJECT AGENT] Response:", response.status, response.data);
    
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to reject agent");
    }
    
    return response.data;
  } catch (error: any) {
    console.error("[REJECT AGENT ERROR]", error);
    
    if (error?.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    } else if (error?.response?.status === 403) {
      throw new Error("You don't have permission to reject agents.");
    } else if (error?.response?.status === 404) {
      throw new Error("Agent not found.");
    } else if (error?.response?.status === 400) {
      throw new Error(error?.response?.data?.message || "Invalid request. Please check the agent data.");
    } else if (error?.response?.status === 500) {
      throw new Error(error?.response?.data?.message || "Server error occurred while rejecting agent. Please try again.");
    }
    
    throw error;
  }
};

export const useAgents = (isFetchAgents?: boolean) => {
  const queryClient = useQueryClient();
  
  const {
    data: agents = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
    enabled: isFetchAgents !== false, // Default to true if not specified
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Approve agent mutation
  const approveAgentMutation = useMutation({
    mutationFn: (agentId: number) => approveAgent(agentId),
    onSuccess: () => {
      // Invalidate and refetch agents data
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent approved successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to approve agent";
      toast.error(errorMessage);
    },
  });

  // Reject agent mutation
  const rejectAgentMutation = useMutation({
    mutationFn: ({ agentId, reason }: { agentId: number; reason: string }) => 
      rejectAgent(agentId, reason),
    onSuccess: () => {
      // Invalidate and refetch agents data
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent rejected successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to reject agent";
      toast.error(errorMessage);
    },
  });

  return {
    agents,
    isLoading,
    error,
    refetch,
    approveAgent: approveAgentMutation.mutate,
    rejectAgent: rejectAgentMutation.mutate,
    isApproving: approveAgentMutation.isPending,
    isRejecting: rejectAgentMutation.isPending,
  };
};
