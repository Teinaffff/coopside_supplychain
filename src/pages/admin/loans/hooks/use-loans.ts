import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { loansMockData } from "../../../../common/data/data";

const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8081/api"
    : "https://supply-chain-api.onrender.com";

const fetchLoans = async (accessToken: string) => {
  //   const res = await fetch(`${baseUrl}/loans`, {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });
  //   if (!res.ok) {
  //     const errorData = await res.json();
  //     toast.error(errorData.message ?? "Failed to fetch loans");
  //     throw new Error(errorData.message ?? "Failed to fetch loans");
  //   }
  //   const data = await res.json();
  //   return data.data ?? [];
  return loansMockData;
};

export const useLoans = (options?: { isFetchLoans: boolean }) => {
  const queryClient = useQueryClient();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const {
    data: loans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["loans"],
    queryFn: () => fetchLoans(accessToken ?? ""),
    enabled: options?.isFetchLoans,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Admin-specific loan approval/disapproval
  const approveLoanMutation = useMutation({
    mutationFn: async (loanId: string) => {
      const res = await fetch(`${baseUrl}/loans/${loanId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to approve loan");
        throw new Error(errorData.message ?? "Failed to approve loan");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      toast.success("Loan approved successfully");
    },
  });

  const disapproveLoanMutation = useMutation({
    mutationFn: async ({
      loanId,
      reason,
    }: {
      loanId: string;
      reason?: string;
    }) => {
      const res = await fetch(`${baseUrl}/loans/${loanId}/disapprove`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to disapprove loan");
        throw new Error(errorData.message ?? "Failed to disapprove loan");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      toast.success("Loan disapproved successfully");
    },
  });

  // Admin can view loan documents for review
  const downloadLoanDocumentsMutation = useMutation({
    mutationFn: async (loanId: string) => {
      const res = await fetch(`${baseUrl}/loans/${loanId}/documents`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to download documents");
        throw new Error(errorData.message ?? "Failed to download documents");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `loan-${loanId}-documents.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return blob;
    },
    onSuccess: () => {
      toast.success("Documents downloaded successfully");
    },
  });

  // Helper functions for data analysis
  const getLoanById = (id: string) => {
    return loans?.find((loan: any) => loan.id === id);
  };

  const getLoansByStatus = (status: string) => {
    return loans?.filter((loan: any) => loan.status === status) ?? [];
  };

  const getLoansByType = (type: string) => {
    return loans?.filter((loan: any) => loan.loanType === type) ?? [];
  };

  const getTotalLoanAmount = (): number => {
    return (
      loans?.reduce((total: number, loan: any) => total + loan.amount, 0) ?? 0
    );
  };

  const getTotalOutstandingBalance = (): number => {
    return (
      loans?.reduce(
        (total: number, loan: any) => total + loan.outstandingBalance,
        0
      ) ?? 0
    );
  };

  const getActiveLoanCount = (): number => {
    return loans?.filter((loan: any) => loan.status === "active").length ?? 0;
  };

  const getPendingApprovalCount = (): number => {
    return (
      loans?.filter((loan: any) => loan.status === "pending_approval").length ??
      0
    );
  };

  const getDisapprovedLoanCount = (): number => {
    return (
      loans?.filter((loan: any) => loan.status === "disapproved").length ?? 0
    );
  };

  return {
    loans,
    isLoading,
    error,
    // Admin-specific actions
    handleApproveLoan: approveLoanMutation.mutateAsync,
    handleDisapproveLoan: disapproveLoanMutation.mutateAsync,
    handleDownloadDocuments: downloadLoanDocumentsMutation.mutateAsync,
    isApproveLoanLoading: approveLoanMutation.isPending,
    isDisapproveLoanLoading: disapproveLoanMutation.isPending,
    isDownloadDocumentsLoading: downloadLoanDocumentsMutation.isPending,
    approveLoanError: approveLoanMutation.error,
    disapproveLoanError: disapproveLoanMutation.error,
    downloadDocumentsError: downloadLoanDocumentsMutation.error,
    // Helper functions
    getLoanById,
    getLoansByStatus,
    getLoansByType,
    getTotalLoanAmount,
    getTotalOutstandingBalance,
    getActiveLoanCount,
    getPendingApprovalCount,
    getDisapprovedLoanCount,
  };
};
