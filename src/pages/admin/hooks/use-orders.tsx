import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ordersMockData } from "../../../common/data/data";

const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8081/api"
    : "https://supply-chain-api.onrender.com";

const fetchOrders = async (accessToken: string) => {
  // For now, return mock data since API is not implemented
  return ordersMockData;
  
  // Future API implementation:
  // const res = await fetch(`${baseUrl}/orders`, {
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  // });
  // if (!res.ok) {
  //   const errorData = await res.json();
  //   toast.error(errorData.message ?? "Failed to fetch orders");
  //   throw new Error(errorData.message ?? "Failed to fetch orders");
  // }
  // const data = await res.json();
  // return data.data ?? [];
};

export const useOrders = (options?: { isFetchOrders: boolean }) => {
  const queryClient = useQueryClient();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(accessToken ?? ""),
    enabled: options?.isFetchOrders,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      // Mock implementation - in real app, this would call API
      toast.success(`Order ${orderId} status updated to ${status}`);
      return { orderId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      toast.error(error.message ?? "Failed to update order status");
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      // Mock implementation
      toast.success(`Order ${orderId} cancelled successfully`);
      return orderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      toast.error(error.message ?? "Failed to cancel order");
    },
  });

  return {
    orders,
    isLoading,
    error,
    updateOrderStatus: updateOrderStatusMutation.mutate,
    cancelOrder: cancelOrderMutation.mutate,
    isUpdatingStatus: updateOrderStatusMutation.isPending,
    isCancelling: cancelOrderMutation.isPending,
  };
};