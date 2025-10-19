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

    // Factory type mapping for better display
    const formatFactoryType = (factoryType: string): string => {
      if (!factoryType) return "Manufacturing";
      
      const typeMap: Record<string, string> = {
        'TEXTILE': 'Textile',
        'TEXTILES': 'Textile',
        'FOOD_PROCESSING': 'Food Processing',
        'FOOD_PROCESSING_PLANT': 'Food Processing',
        'MANUFACTURING': 'Manufacturing',
        'GARMENT': 'Garment',
        'GARMENT_FACTORY': 'Garment',
        'AGRICULTURE': 'Agriculture',
        'CHEMICAL': 'Chemical',
        'PHARMACEUTICAL': 'Pharmaceutical',
        'ELECTRONICS': 'Electronics',
        'AUTOMOTIVE': 'Automotive',
        'CONSTRUCTION': 'Construction',
        'METAL_WORKING': 'Metal Working',
        'PLASTIC': 'Plastic',
        'PAPER': 'Paper',
        'WOOD': 'Wood',
        'LEATHER': 'Leather',
        'CERAMICS': 'Ceramics',
        'GLASS': 'Glass',
      };
      
      const upperType = factoryType.toUpperCase();
      return typeMap[upperType] || factoryType.charAt(0).toUpperCase() + factoryType.slice(1).toLowerCase();
    };

    // Debug: Log factory types from API
    console.log("=== FACTORY TYPES FROM API ===");
    factoriesData.forEach((factory, index) => {
      console.log(`Factory ${index + 1}:`, {
        name: factory.name || factory.factoryName || factory.businessName,
        factoryType: factory.factoryType,
        formattedType: formatFactoryType(factory.factoryType || "")
      });
    });
    console.log("=== END FACTORY TYPES ===");

      // Transform the API response to match our expected structure
      return factoriesData.map((factory: any) => {
        const factoryType = factory.factoryType || "";
        const formattedType = formatFactoryType(factoryType);
        
        // Find primary bank account or use first one
        const primaryBankAccount = factory.bankAccountInfo?.find((bank: any) => bank.isPrimary) || factory.bankAccountInfo?.[0];
        
        return {
        id: factory.id || factory.factoryId,
        name: factory.name || factory.factoryName || factory.businessName,
        type: "factory" as const,
        status: statusMap[factory.superAdminApprovalStatus] || statusMap[factory.superAdminStatus] || "Pending", // Super Admin Status (this portal)
        adminStatus: statusMap[factory.adminApprovalStatus] || statusMap[factory.adminStatus] || "Pending", // Admin Status (external portal)
        docs: factory.docs || factory.documents || [],
        createdAt: factory.createdAt,
        updatedAt: factory.updatedAt,
        adminApprovedBy: factory.adminApprovedBy,
        adminApprovedAt: factory.adminApprovedAt,
        form: {
          factoryName: String(factory.name || factory.factoryName || factory.businessName || ""),
          registrationNo: String(factory.registrationNo || factory.registrationNumber || factory.businessLicense || ""),
          licenseNumber: String(factory.licenseNumber || factory.businessLicense || factory.registrationNumber || ""),
          licenseExpirationDate: String(factory.licenseExpiryDate || factory.licenseExpirationDate || factory.licenseExpiry || ""),
          location: String(factory.location || factory.address || factory.factoryLocation || ""),
          address: String(factory.factoryAddresses || factory.address || factory.location || factory.factoryLocation || ""),
          tin: String(factory.tinNumber || factory.tin || factory.taxId || ""),
          contact: String(factory.contact || factory.contactPerson || ""),
          alternateContactPerson: String(factory.alternateContactPerson || ""),
          phone: String(factory.phone || factory.phoneNumber || factory.contactPhone || ""),
          email: String(factory.email || factory.emailAddress || factory.contactEmail || ""),
          industry: String(factory.factoryType || factory.industry || factory.industryType || factory.businessSector || ""),
          factoryType: formattedType,
          type: formattedType,
          bankAccount: String(factory.bankAccount || factory.bankDetails || ""),
          bankAccountNumber: String(
            primaryBankAccount?.accountNumber || 
            factory.bankAccountNumber || 
            factory.bankAccount || 
            ""
          ),
          bankName: String(
            primaryBankAccount?.bankName || 
            factory.bankName || 
            ""
          ),
          bankAccounts: factory.bankAccountInfo || factory.bankAccounts || [],
          accountName: String(
            primaryBankAccount?.accountName || 
            factory.accountName || 
            ""
          ),
          bankBranch: String(
            primaryBankAccount?.branchName || 
            factory.bankBranch || 
            ""
          ),
          capacity: String(factory.capacity || factory.productionCapacity || ""),
          linkedCoops: String(factory.linkedCoops || factory.linkedCooperatives || ""),
        },
      };
    });
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

// Reject factory function
const rejectFactory = async (factoryId: number, reason: string): Promise<void> => {
  try {
    console.log("[REJECT FACTORY] Input - factoryId:", factoryId, "Type:", typeof factoryId, "Reason:", reason);
    
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No authentication token found. Please login again.");
    }

    // Validate factoryId is a number
    if (typeof factoryId !== 'number' || isNaN(factoryId)) {
      throw new Error(`Invalid factory ID: ${factoryId} (type: ${typeof factoryId})`);
    }

    // Validate reason is not empty
    if (!reason || reason.trim() === '') {
      throw new Error("Rejection reason is required");
    }

    // Send reason as query parameter (backend expects @RequestParam)
    const url = `/v1/factories/${factoryId}/reject?reason=${encodeURIComponent(reason.trim())}`;
    console.log("[REJECT FACTORY] URL:", url);
    
    const response = await API.post(url);
    
    console.log("[REJECT FACTORY] Response:", response.status, response.data);
    
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to reject factory");
    }
    
    return response.data;
  } catch (error: any) {
    console.error("[REJECT FACTORY ERROR]", error);
    
    if (error?.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    } else if (error?.response?.status === 403) {
      throw new Error("You don't have permission to reject factories.");
    } else if (error?.response?.status === 404) {
      throw new Error("Factory not found.");
    } else if (error?.response?.status === 400) {
      throw new Error(error?.response?.data?.message || "Invalid request. Please check the factory data.");
    } else if (error?.response?.status === 500) {
      throw new Error(error?.response?.data?.message || "Server error occurred while rejecting factory. Please try again.");
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
    mutationFn: (factoryId: number) => approveFactory(factoryId),
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

  // Reject factory mutation
  const rejectFactoryMutation = useMutation({
    mutationFn: ({ factoryId, reason }: { factoryId: number; reason: string }) => 
      rejectFactory(factoryId, reason),
    onSuccess: () => {
      // Invalidate and refetch factories data
      queryClient.invalidateQueries({ queryKey: ["factories"] });
      toast.success("Factory rejected successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to reject factory";
      toast.error(errorMessage);
    },
  });

  return {
    factories,
    isLoading,
    error,
    refetch,
    approveFactory: approveFactoryMutation.mutate,
    rejectFactory: rejectFactoryMutation.mutate,
    isApproving: approveFactoryMutation.isPending,
    isRejecting: rejectFactoryMutation.isPending,
  };
};
