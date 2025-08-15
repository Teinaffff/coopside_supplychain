  

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Seller } from "../../../constants/interface/admin/seller";
import toast from "react-hot-toast";
import { sellerMockData } from "../../../common/data/data";

const fetchSellers = async () => {
  // const res = await fetch('/api/sellers');
  // if (!res.ok) {
  //   const errorData = await res.json();
  //   toast.error(errorData.message ?? 'Failed to fetch sellers');
  //   throw new Error(errorData.message ?? 'Failed to fetch sellers');
  // }
  // const data = await res.json();
  return sellerMockData;
};

export const useSellers = (options?: { isFetchSellers: boolean }) => {
  const queryClient = useQueryClient();

  const {
    data: sellers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sellers"],
    queryFn: fetchSellers,
    enabled: options?.isFetchSellers,
  });

  const addSellerMutation = useMutation({
    mutationFn: async (data: Seller) => {
      const { sellerId, ...rest } = data;
      const res = await fetch("/api/sellers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to create seller");
        throw new Error(errorData.message ?? "Failed to create seller");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      toast.success("Seller created successfully");
    },
  });

  const editSellerMutation = useMutation({
    mutationFn: async (data: Seller) => {
      const { sellerId, ...rest } = data;

      const res = await fetch(`/api/sellers/${sellerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to update seller");
        throw new Error(errorData.message ?? "Failed to update seller");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      toast.success("Seller updated successfully");
    },
  });

  const handleDeleteSeller = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/sellers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to delete seller");
        throw new Error(errorData.message ?? "Failed to delete seller");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      toast.success("Seller deleted successfully");
    },
  });

  return {
    sellers,
    isLoading,
    error,
    handleAddSeller: addSellerMutation.mutateAsync,
    handleEditSeller: editSellerMutation.mutateAsync,
    isAddSellerLoading: addSellerMutation.isPending,
    isEditSellerLoading: editSellerMutation.isPending,
    addSellerError: addSellerMutation.error,
    editSellerError: editSellerMutation.error,
    handleDeleteSeller: handleDeleteSeller.mutateAsync,
    isDeleteSellerLoading: handleDeleteSeller.isPending,
    deleteSellerError: handleDeleteSeller.error,
  };
};