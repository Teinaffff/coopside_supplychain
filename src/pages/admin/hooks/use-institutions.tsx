import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { institutionsMockData } from "../../../common/data/data";
import { InstitutionFormValues } from "../../../schema/admin/institution";

const fetchInstitutions = async () => {
  // const res = await fetch('/api/institutions');
  // if (!res.ok) {
  //   const errorData = await res.json();
  //   toast.error(errorData.message ?? 'Failed to fetch institutions');
  //   throw new Error(errorData.message ?? 'Failed to fetch institutions');
  // }
  // const data = await res.json();
  return institutionsMockData;
};

export const useInstitutions = (options?: { isFetchInstitutions: boolean }) => {
  const queryClient = useQueryClient();

  const {
    data: institutions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["institutions"],
    queryFn: fetchInstitutions,
    enabled: options?.isFetchInstitutions,
  });

  const addInstitutionMutation = useMutation({
    mutationFn: async (data: InstitutionFormValues) => {
      const { id, ...rest } = data;
      const res = await fetch("/api/institutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
