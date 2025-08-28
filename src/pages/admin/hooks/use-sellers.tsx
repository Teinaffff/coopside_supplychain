import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
// import { sellerMockData } from "../../../common/data/data";
import { useSelector } from "react-redux";
import { SellerFormValues } from "../../../schema/admin/seller";
import { RootState } from "../../../store";

const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8081/api"
    : "https://supply-chain-api.onrender.com";

const fetchSellers = async (accessToken: string) => {
  const res = await fetch(`${baseUrl}/agents`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to fetch sellers");
    throw new Error(errorData.message ?? "Failed to fetch sellers");
  }
  const data = await res.json();
  return data.data ?? [];
};

export const useSellers = (options?: { isFetchSellers: boolean }) => {
  const queryClient = useQueryClient();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const {
    data: sellers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sellers"],
    queryFn: () => fetchSellers(accessToken ?? ""),
    enabled: options?.isFetchSellers,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const addSellerMutation = useMutation({
    mutationFn: async (data: SellerFormValues) => {
      const { id, ...rest } = data;
      const res = await fetch(`${baseUrl}/agents/onboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
    mutationFn: async (data: SellerFormValues) => {
      const { id, ...rest } = data;

      const res = await fetch(`${baseUrl}/agents/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
      const res = await fetch(`${baseUrl}/agents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
