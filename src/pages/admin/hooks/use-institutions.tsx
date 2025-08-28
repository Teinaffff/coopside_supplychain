import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
// import { institutionsMockData } from "../../../common/data/data";
import {
  BranchFormValues,
  InstitutionFormValues,
} from "../../../schema/admin/institution";
import { RootState } from "../../../store";

const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8081/api"
    : "https://supply-chain-api.onrender.com";

const fetchInstitutions = async (accessToken: string) => {
  const res = await fetch(`${baseUrl}/institutions`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to fetch institutions");
    throw new Error(errorData.message ?? "Failed to fetch institutions");
  }
  const data = await res.json();
  return data.data ?? [];
};

export const useInstitutions = (options?: { isFetchInstitutions: boolean }) => {
  const queryClient = useQueryClient();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const {
    data: institutions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["institutions"],
    queryFn: () => fetchInstitutions(accessToken ?? ""),
    enabled: options?.isFetchInstitutions,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const addInstitutionMutation = useMutation({
    mutationFn: async (data: InstitutionFormValues) => {
      const { id, ...rest } = data;
      const res = await fetch(`${baseUrl}/institutions/onboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to create institution");
        throw new Error(errorData.message ?? "Failed to create institution");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      toast.success("Institution created successfully");
    },
  });

  const editInstitutionMutation = useMutation({
    mutationFn: async (data: InstitutionFormValues) => {
      const { id, ...rest } = data;

      const res = await fetch(`/api/institutions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to update institution");
        throw new Error(errorData.message ?? "Failed to update institution");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      toast.success("Institution updated successfully");
    },
  });

  const handleDeleteInstitution = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/institutions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to delete institution");
        throw new Error(errorData.message ?? "Failed to delete institution");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      toast.success("Institution deleted successfully");
    },
  });

  return {
    institutions,
    isLoading,
    error,
    handleAddInstitution: addInstitutionMutation.mutateAsync,
    handleEditInstitution: editInstitutionMutation.mutateAsync,
    isAddInstitutionLoading: addInstitutionMutation.isPending,
    isEditInstitutionLoading: editInstitutionMutation.isPending,
    addInstitutionError: addInstitutionMutation.error,
    editInstitutionError: editInstitutionMutation.error,
    handleDeleteInstitution: handleDeleteInstitution.mutateAsync,
    isDeleteInstitutionLoading: handleDeleteInstitution.isPending,
    deleteInstitutionError: handleDeleteInstitution.error,
  };
};

const fetchInstitutionBranches = async (
  accessToken: string,
  institutionId: string
) => {
  const res = await fetch(`${baseUrl}/institutions/${institutionId}/branches`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to fetch branches");
    throw new Error(errorData.message ?? "Failed to fetch branches");
  }
  const data = await res.json();
  return data.data ?? [];
};

export const useInstitutionBranches = (
  institutionId: string,
  options?: { enabled?: boolean }
) => {
  const queryClient = useQueryClient();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const {
    data: branches,
    isLoading: isBranchesLoading,
    error: branchesError,
  } = useQuery({
    queryKey: ["institution-branches", institutionId],
    queryFn: () => fetchInstitutionBranches(accessToken ?? "", institutionId),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const addBranchMutation = useMutation({
    mutationFn: async (data: BranchFormValues) => {
      const res = await fetch(
        `${baseUrl}/institutions/${institutionId}/branches`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to add branch");
        throw new Error(errorData.message ?? "Failed to add branch");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution-branches", institutionId],
      });
      toast.success("Branch added successfully");
    },
  });

  const updateBranchMutation = useMutation({
    mutationFn: async ({
      branchId,
      data,
    }: {
      branchId: string;
      data: BranchFormValues;
    }) => {
      const res = await fetch(
        `${baseUrl}/institutions/${institutionId}/branches/${branchId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to update branch");
        throw new Error(errorData.message ?? "Failed to update branch");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution-branches", institutionId],
      });
      toast.success("Branch updated successfully");
    },
  });

  const activateBranchMutation = useMutation({
    mutationFn: async ({ branchId }: { branchId: string }) => {
      const res = await fetch(
        `${baseUrl}/institutions/${institutionId}/branches/${branchId}/activate`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to activate branch");
        throw new Error(errorData.message ?? "Failed to activate branch");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution-branches", institutionId],
      });
      toast.success("Branch activated successfully");
    },
  });

  const deactivateBranchMutation = useMutation({
    mutationFn: async ({ branchId }: { branchId: string }) => {
      const res = await fetch(
        `${baseUrl}/institutions/${institutionId}/branches/${branchId}/deactivate`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to deactivate branch");
        throw new Error(errorData.message ?? "Failed to deactivate branch");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution-branches", institutionId],
      });
      toast.success("Branch deactivated successfully");
    },
  });

  return {
    branches,
    isBranchesLoading,
    branchesError,
    handleAddBranch: addBranchMutation.mutateAsync,
    handleUpdateBranch: updateBranchMutation.mutateAsync,
    handleDeactivateBranch: deactivateBranchMutation.mutateAsync,
    handleActivateBranch: activateBranchMutation.mutateAsync,
    isAddBranchLoading: addBranchMutation.isPending,
    isUpdateBranchLoading: updateBranchMutation.isPending,
    isDeactivateBranchLoading: deactivateBranchMutation.isPending,
    isActivateBranchLoading: activateBranchMutation.isPending,
    addBranchError: addBranchMutation.error,
    updateBranchError: updateBranchMutation.error,
    deactivateBranchError: deactivateBranchMutation.error,
    activateBranchError: activateBranchMutation.error,
  };
};
