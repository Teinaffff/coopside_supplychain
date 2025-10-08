import { useEffect, useState } from "react";
import API from "../../../config/axios-config";

export type EntityStatus = "Pending" | "Approved" | "Rejected";

export function useAgents() {
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isApproving, setIsApproving] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/v1/agents");
      const data = response.data;

      if (data?.success && Array.isArray(data.data)) {
        const statusMap: Record<string, EntityStatus> = {
          APPROVED: "Approved",
          PENDING: "Pending",
          REJECTED_BY_ADMIN: "Rejected",
          REJECTED: "Rejected",
        };

        const mapped = data.data.map((a: any) => ({
          id: a.id,
          name: a.fullLegalName || a.username || `Agent ${a.id}`,
          type: "agent" as const,
          status: statusMap[a.superAdminApprovalStatus] || "Pending", // Super Admin Status (this portal)
          adminStatus: statusMap[a.adminApprovalStatus] || "Pending", // Admin Status (external portal)
          docs: [], // you can populate if API provides docs
          form: a,
        }));

        setAgents(mapped);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    load();
  };

  useEffect(() => {
    load();
  }, []);

  const approveAgent = async (id: number) => {
    setIsApproving(true);
    try {
      await API.post(`/v1/agents/${id}/approve`);
      // Refetch data to get updated status from backend
      await refetch();
    } catch (err: any) {
      console.error("Error approving agent:", err);
      throw new Error(err?.response?.data?.message || "Failed to approve agent");
    } finally {
      setIsApproving(false);
    }
  };

  const rejectAgent = async (id: number, reason: string) => {
    setIsApproving(true);
    try {
      await API.post(`/v1/agents/${id}/reject`, { reason });
      // Refetch data to get updated status from backend
      await refetch();
    } catch (err: any) {
      console.error("Error rejecting agent:", err);
      throw new Error(err?.response?.data?.message || "Failed to reject agent");
    } finally {
      setIsApproving(false);
    }
  };

  return { agents, isLoading, error, approveAgent, rejectAgent, refetch, isApproving };
}
