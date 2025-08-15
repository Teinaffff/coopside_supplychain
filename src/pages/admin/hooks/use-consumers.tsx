  

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Consumer } from "../../../constants/interface/admin/consumer";
import toast from "react-hot-toast";
import { consumersMockData } from "../../../common/data/data";

const fetchConsumers = async () => {
  // const res = await fetch('/api/consumers');
  // if (!res.ok) {
  //   const errorData = await res.json();
  //   toast.error(errorData.message ?? 'Failed to fetch consumers');
  //   throw new Error(errorData.message ?? 'Failed to fetch consumers');
  // }
  // const data = await res.json();
  return consumersMockData;
};

export const useConsumers = (options?: { isFetchConsumers: boolean }) => {
  const queryClient = useQueryClient();

  const {
    data: consumers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["consumers"],
    queryFn: fetchConsumers,
    enabled: options?.isFetchConsumers,
  });

  const addConsumerMutation = useMutation({
    mutationFn: async (data: Consumer) => {
      const { consumerId, ...rest } = data;
      const res = await fetch("/api/consumers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    mutationFn: async (data: Consumer) => {
      const { consumerId, ...rest } = data;

      const res = await fetch(`/api/consumers/${consumerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
      const res = await fetch(`/api/consumers/${id}`, {
        method: "DELETE",
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