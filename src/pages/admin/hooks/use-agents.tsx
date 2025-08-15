  

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Agent } from "../../../constants/interface/admin/agent";
import toast from "react-hot-toast";
import { agentsMockData } from "../../../common/data/data";

const fetchAgents = async () => {
  // const res = await fetch('/api/agents');
  // if (!res.ok) {
  //   const errorData = await res.json();
  //   toast.error(errorData.message ?? 'Failed to fetch agents');
  //   throw new Error(errorData.message ?? 'Failed to fetch agents');
  // }
  // const data = await res.json();
  return agentsMockData;
};

export const useAgents = (options?: { isFetchAgents: boolean }) => {
  const queryClient = useQueryClient();

  const {
    data: agents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
    enabled: options?.isFetchAgents,
  });

  const addAgentMutation = useMutation({
    mutationFn: async (data: Agent) => {
      const { agentId, ...rest } = data;
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to create agent");
        throw new Error(errorData.message ?? "Failed to create agent");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent created successfully");
    },
  });

  const editAgentMutation = useMutation({
    mutationFn: async (data: Agent) => {
      const { agentId, ...rest } = data;

      const res = await fetch(`/api/agents/${agentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to update agent");
        throw new Error(errorData.message ?? "Failed to update agent");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent updated successfully");
    },
  });

  const handleDeleteAgent = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/agents/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to delete agent");
        throw new Error(errorData.message ?? "Failed to delete agent");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent deleted successfully");
    },
  });

  return {
    agents,
    isLoading,
    error,
    handleAddAgent: addAgentMutation.mutateAsync,
    handleEditAgent: editAgentMutation.mutateAsync,
    isAddAgentLoading: addAgentMutation.isPending,
    isEditAgentLoading: editAgentMutation.isPending,
    addAgentError: addAgentMutation.error,
    editAgentError: editAgentMutation.error,
    handleDeleteAgent: handleDeleteAgent.mutateAsync,
    isDeleteAgentLoading: handleDeleteAgent.isPending,
    deleteAgentError: handleDeleteAgent.error,
  };
};
