import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { consumersMockData } from "../../../common/data/data";
import { ConsumerFormValues } from "../../../schema/admin/consumer";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8081/api"
    : "https://supply-chain-api.onrender.com";

const fetchConsumers = async (accessToken: string) => {
  const res = await fetch(`${baseUrl}/consumers`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to fetch consumers");
    throw new Error(errorData.message ?? "Failed to fetch consumers");
  }
  const data = await res.json();

  return consumersMockData;
  // return data.data ??[];
};

export const useConsumers = (options?: { isFetchConsumers: boolean }) => {
  const queryClient = useQueryClient();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const {
    data: consumers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["consumers"],
    queryFn: () => fetchConsumers(accessToken ?? ""),
    enabled: options?.isFetchConsumers ?? false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const addConsumerMutation = useMutation({
    mutationFn: async (data: ConsumerFormValues) => {
      const { id, ...rest } = data;
      const res = await fetch(`${baseUrl}/consumers/onboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to create consumer");
        throw new Error(errorData.message ?? "Failed to create consumer");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumers"] });
      toast.success("Consumer created successfully");
    },
  });

  const editConsumerMutation = useMutation({
    mutationFn: async (data: ConsumerFormValues) => {
      const { id, ...rest } = data;

      const res = await fetch(`${baseUrl}/consumers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to update consumer");
        throw new Error(errorData.message ?? "Failed to update consumer");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumers"] });
      toast.success("Consumer updated successfully");
    },
  });

  const handleDeleteConsumer = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${baseUrl}/consumers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to delete consumer");
        throw new Error(errorData.message ?? "Failed to delete consumer");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumers"] });
      toast.success("Consumer deleted successfully");
    },
  });

  return {
    consumers,
    isLoading,
    error,
    handleAddConsumer: addConsumerMutation.mutateAsync,
    handleEditConsumer: editConsumerMutation.mutateAsync,
    isAddConsumerLoading: addConsumerMutation.isPending,
    isEditConsumerLoading: editConsumerMutation.isPending,
    addConsumerError: addConsumerMutation.error,
    editConsumerError: editConsumerMutation.error,
    handleDeleteConsumer: handleDeleteConsumer.mutateAsync,
    isDeleteConsumerLoading: handleDeleteConsumer.isPending,
    deleteConsumerError: handleDeleteConsumer.error,
  };
};
