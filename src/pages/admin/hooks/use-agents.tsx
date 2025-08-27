import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
// import { agentsMockData } from "../../../common/data/data";
import { useSelector } from "react-redux";
import { AgentFormValues } from "../../../schema/admin/agent";
import { RootState } from "../../../store";

const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8081/api"
    : "https://supply-chain-api.onrender.com";

const fetchAgents = async (accessToken: string) => {
  const res = await fetch(`${baseUrl}/agents`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to fetch agents");
    throw new Error(errorData.message ?? "Failed to fetch agents");
  }
  const data = await res.json();
  return data.data ?? [];
};

export const useAgents = (options?: { isFetchAgents: boolean }) => {
  const queryClient = useQueryClient();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const {
    data: agents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agents"],
    queryFn: () => fetchAgents(accessToken ?? ""),
    enabled: options?.isFetchAgents,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const addAgentMutation = useMutation({
    mutationFn: async (data: AgentFormValues) => {
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
    mutationFn: async (data: AgentFormValues) => {
      const { id, ...rest } = data;

      const res = await fetch(`/api/agents/${id}`, {
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
