import { useEffect, useState } from "react";
import API from "../../../config/axios-config";

type EntityStatus = "Pending" | "Approved" | "Rejected";

export function useInstitutions() {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/v1/institutions");
      const data = response.data; // ✅ no parentheses

      if (data?.success && Array.isArray(data.data)) {
        const statusMap: Record<string, EntityStatus> = {
          APPROVED: "Approved",
          PENDING: "Pending",
          REJECTED_BY_ADMIN: "Rejected",
          REJECTED: "Rejected",
        };

        const mapped = data.data.map((i: any) => ({
          id: i.id,
          name: i.fullLegalName || i.username || `Institution ${i.id}`,
          type: "institution" as const,
          status: statusMap[i.superAdminApprovalStatus] || "Pending", // Super Admin Status (this portal)
          adminStatus: statusMap[i.adminApprovalStatus] || "Pending", // Admin Status (external portal)
          docs: [],
          form: i,
        }));

        setInstitutions(mapped);
      } else {
        setError("Unexpected API response format");
      }
    } catch (err: any) {
      // More helpful error handling
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load institutions"
      );
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

  const approveInstitution = async (id: number) => {
    try {
      await API.post(`/v1/institutions/${id}/approve`);
      // Refetch data to get updated status from backend
      await refetch();
    } catch (err: any) {
      console.error("Error approving institution:", err);
      throw new Error(err?.response?.data?.message || "Failed to approve institution");
    }
  };

  const rejectInstitution = async (id: number, reason: string) => {
    try {
      await API.post(`/v1/institutions/${id}/reject`, { reason });
      // Refetch data to get updated status from backend
      await refetch();
    } catch (err: any) {
      console.error("Error rejecting institution:", err);
      throw new Error(err?.response?.data?.message || "Failed to reject institution");
    }
  };

  return { institutions, isLoading, error, refetch, approveInstitution, rejectInstitution };
}
