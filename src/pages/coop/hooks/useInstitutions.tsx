import { useEffect, useState } from "react";
import API from "../../../config/axios-config";

type EntityStatus = "Pending" | "Approved" | "Rejected";

export function useInstitutions() {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
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
            status:
              statusMap[i.approvalStatus] ||
              (i.isActive ? "Approved" : "Pending"),
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
    }

    load();
  }, []);

  return { institutions, isLoading, error };
}
