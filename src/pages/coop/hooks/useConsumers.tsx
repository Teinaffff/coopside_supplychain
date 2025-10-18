import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import consumerService from '../../../services/consumerService';

// Fetch consumers by institution
const fetchConsumersByInstitution = async (institutionId: number) => {
  try {
    const consumers = await consumerService.getConsumersByInstitution(institutionId);
    
    // Transform consumers data to match our interface
    return consumers.map((consumer: any) => {
      // Map partner status (adminStatus) - check multiple possible field names
      let mappedAdminStatus: "Approved" | "Rejected" | "Pending" = "Pending";
      if (consumer.approvalStatus) {
        mappedAdminStatus = consumer.approvalStatus === "APPROVED" || consumer.approvalStatus === "Approved" ? "Approved" :
                           consumer.approvalStatus === "REJECTED" || consumer.approvalStatus === "Rejected" ? "Rejected" : "Pending";
      } else if (consumer.partnerStatus) {
        mappedAdminStatus = consumer.partnerStatus === "APPROVED" || consumer.partnerStatus === "Approved" ? "Approved" :
                           consumer.partnerStatus === "REJECTED" || consumer.partnerStatus === "Rejected" ? "Rejected" : "Pending";
      } else if (consumer.coopAdminStatus) {
        mappedAdminStatus = consumer.coopAdminStatus === "APPROVED" || consumer.coopAdminStatus === "Approved" ? "Approved" :
                           consumer.coopAdminStatus === "REJECTED" || consumer.coopAdminStatus === "Rejected" ? "Rejected" : "Pending";
      }
      
      // Map super admin status - check multiple possible field names
      let mappedStatus: "Approved" | "Rejected" | "Pending" = "Pending";
      if (consumer.superAdminStatus) {
        mappedStatus = consumer.superAdminStatus === "APPROVED" || consumer.superAdminStatus === "Approved" ? "Approved" :
                      consumer.superAdminStatus === "REJECTED" || consumer.superAdminStatus === "Rejected" ? "Rejected" : "Pending";
      } else if (consumer.bankApprovalStatus) {
        mappedStatus = consumer.bankApprovalStatus === "APPROVED" || consumer.bankApprovalStatus === "Approved" ? "Approved" :
                      consumer.bankApprovalStatus === "REJECTED" || consumer.bankApprovalStatus === "Rejected" ? "Rejected" : "Pending";
      } else if (consumer.status) {
        mappedStatus = consumer.status === "APPROVED" || consumer.status === "Approved" ? "Approved" :
                      consumer.status === "REJECTED" || consumer.status === "Rejected" ? "Rejected" : "Pending";
      }

      return {
        id: consumer.id,
        fullName: consumer.fullLegalName || consumer.fullName || consumer.name || `Consumer ${consumer.id}`,
        email: consumer.email || "N/A",
        phoneNumber: consumer.phoneNumber || consumer.phone || "N/A",
        nationalId: consumer.nationalId || consumer.idNumber || consumer.national_id || consumer.id_number || consumer.nationalIdNumber || "N/A",
        employeeId: consumer.employeeId || consumer.employee_id || consumer.empId || consumer.emp_id || consumer.employeeNumber || "N/A",
        tin: consumer.tin || consumer.tinNumber || "N/A",
        jobTitle: consumer.jobTitle || consumer.position || consumer.title || "N/A",
        department: consumer.department || "N/A",
        grossSalary: consumer.grossSalary || consumer.grossIncome || 0,
        netSalary: consumer.netSalary || consumer.netIncome || 0,
        employmentType: consumer.employmentType || consumer.employeeType || consumer.empType || consumer.employee_type || "N/A",
        maritalStatus: consumer.maritalStatus || consumer.marital_status || "N/A",
        numberOfDependants: consumer.numberOfDependants || consumer.dependants || consumer.number_of_dependants || 0,
        approvedBy: consumer.approvedBy || consumer.approved_by || "",
        approvedAt: consumer.approvedAt || consumer.approved_at || "",
        rejectedBy: consumer.rejectedBy || consumer.rejected_by || "",
        rejectedAt: consumer.rejectedAt || consumer.rejected_at || "",
        bankInfo: consumer.bankInfo || consumer.bank_info || consumer.bankAccounts || [],
        adminStatus: mappedAdminStatus,
        status: mappedStatus,
        createdAt: consumer.createdAt || new Date().toISOString(),
        institutionId: institutionId,
      };
    });
  } catch (error) {
    console.error('Error fetching consumers:', error);
    throw error;
  }
};

// Approve consumer function
const approveConsumer = async (consumerId: number): Promise<void> => {
  try {
    await consumerService.approveConsumer(consumerId);
  } catch (error: any) {
    console.error("[APPROVE CONSUMER ERROR]", error);
    throw error;
  }
};

// Reject consumer function
const rejectConsumer = async (consumerId: number, reason: string): Promise<void> => {
  try {
    await consumerService.rejectConsumer(consumerId, reason);
  } catch (error: any) {
    console.error("[REJECT CONSUMER ERROR]", error);
    throw error;
  }
};

export const useConsumers = (institutionId?: number, isFetchConsumers?: boolean) => {
  const queryClient = useQueryClient();
  
  const {
    data: consumers = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["consumers", institutionId],
    queryFn: () => fetchConsumersByInstitution(institutionId!),
    enabled: isFetchConsumers !== false && !!institutionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Approve consumer mutation
  const approveConsumerMutation = useMutation({
    mutationFn: (consumerId: number) => approveConsumer(consumerId),
    onSuccess: () => {
      // Invalidate and refetch consumers data
      queryClient.invalidateQueries({ queryKey: ["consumers", institutionId] });
      toast.success("Consumer approved successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to approve consumer";
      toast.error(errorMessage);
    },
  });

  // Reject consumer mutation
  const rejectConsumerMutation = useMutation({
    mutationFn: ({ consumerId, reason }: { consumerId: number; reason: string }) => 
      rejectConsumer(consumerId, reason),
    onSuccess: () => {
      // Invalidate and refetch consumers data
      queryClient.invalidateQueries({ queryKey: ["consumers", institutionId] });
      toast.success("Consumer rejected successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to reject consumer";
      toast.error(errorMessage);
    },
  });

  return {
    consumers,
    isLoading,
    error,
    refetch,
    approveConsumer: approveConsumerMutation.mutate,
    rejectConsumer: rejectConsumerMutation.mutate,
    isApproving: approveConsumerMutation.isPending,
    isRejecting: rejectConsumerMutation.isPending,
  };
};
