import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../config/axios-config";
import { toast } from "react-hot-toast";

interface FactoryDoc {
  id: number;
  name: string;
  uploadedAt: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface Factory {
  id: number;
  name: string;
  type: "factory";
  status: "Pending" | "Approved" | "Rejected"; // Super Admin Status (this portal)
  adminStatus: "Pending" | "Approved" | "Rejected"; // Admin Status (external portal)
  docs: FactoryDoc[];
  form: Record<string, any>;
}

const fetchFactories = async (): Promise<Factory[]> => {
  try {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No authentication token found. Please login again.");
    }

    const response = await API.get("/v1/factories");
    const data = response.data;
    
    // Handle different response structures
    const factoriesData = data?.data || data || [];
    
    // Ensure we have an array
    if (!Array.isArray(factoriesData)) {
      console.warn("[FACTORIES API] Expected array but got:", typeof factoriesData);
      return [];
    }
    
    // Status mapping for consistent display
    const statusMap: Record<string, EntityStatus> = {
      APPROVED: "Approved",
      PENDING: "Pending", 
      REJECTED_BY_ADMIN: "Rejected",
      REJECTED: "Rejected",
    };

    // Transform the API response to match our expected structure
    return factoriesData.map((factory: any) => ({
      id: factory.id || factory.factoryId,
      name: factory.name || factory.factoryName || factory.businessName,
      type: "factory" as const,
      status: statusMap[factory.superAdminApprovalStatus] || statusMap[factory.superAdminStatus] || "Pending", // Super Admin Status (this portal)
      adminStatus: statusMap[factory.adminApprovalStatus] || statusMap[factory.adminStatus] || "Pending", // Admin Status (external portal)
      docs: factory.docs || factory.documents || [],
      form: {
        factoryName: String(factory.name || factory.factoryName || factory.businessName || ""),
        registrationNo: String(factory.registrationNo || factory.registrationNumber || factory.businessLicense || ""),
        location: String(factory.location || factory.address || factory.factoryLocation || ""),
        tin: String(factory.tin || factory.taxId || ""),
        contact: String(factory.contact || factory.contactPerson || ""),
        phone: String(factory.phone || factory.phoneNumber || factory.contactPhone || ""),
        email: String(factory.email || factory.emailAddress || factory.contactEmail || ""),
        industry: String(factory.industry || factory.industryType || factory.businessSector || ""),
        bankAccount: String(factory.bankAccount || factory.bankDetails || ""),
        capacity: String(factory.capacity || factory.productionCapacity || ""),
        linkedCoops: String(factory.linkedCoops || factory.linkedCooperatives || ""),
      },
    }));
  } catch (error: any) {
    console.error("[FACTORIES API ERROR]", error);
    
    // Handle specific authentication errors
    if (error?.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    } else if (error?.response?.status === 403) {
      throw new Error("You don't have permission to access factories data.");
    } else if (error?.message?.includes("No authentication token")) {
      throw error; // Re-throw authentication token errors
    }
    
    throw error;
  }
};

// Approve factory function
const approveFactory = async (factoryId: number): Promise<void> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No authentication token found. Please login again.");
    }

    const response = await API.post(`/v1/factories/${factoryId}/approve`);
    
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to approve factory");
    }
    
    return response.data;
  } catch (error: any) {
    console.error("[APPROVE FACTORY ERROR]", error);
    
    if (error?.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    } else if (error?.response?.status === 403) {
      throw new Error("You don't have permission to approve factories.");
    } else if (error?.response?.status === 404) {
      throw new Error("Factory not found.");
    } else if (error?.response?.status === 400) {
      throw new Error(error?.response?.data?.message || "Invalid request. Please check the factory data.");
    }
    
    throw error;
  }
};

export const useFactories = (isFetchFactories?: boolean) => {
  const queryClient = useQueryClient();
  
  const {
    data: factories = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["factories"],
    queryFn: fetchFactories,
    enabled: isFetchFactories !== false, // Default to true if not specified
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Approve factory mutation
  const approveFactoryMutation = useMutation({
    mutationFn: approveFactory,
    onSuccess: () => {
      // Invalidate and refetch factories data
      queryClient.invalidateQueries({ queryKey: ["factories"] });
      toast.success("Factory approved successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to approve factory";
      toast.error(errorMessage);
    },
  });

  return {
    factories,
    isLoading,
    error,
    refetch,
    approveFactory: approveFactoryMutation.mutate,
    isApproving: approveFactoryMutation.isPending,
  };
};
