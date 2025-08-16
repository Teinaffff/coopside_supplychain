import { useQuery } from "@tanstack/react-query";
import { adminStatsData } from "../../../common/data/data";

interface UseKpiProps {
  enabled?: boolean;
}

const fetchKpi = async () => {
  // Example: const response = await axios.get('/api/admin/kpi');
  // return response.data;

  return adminStatsData;
};

export const useHomeStats = ({ enabled = true }: UseKpiProps = {}) => {
  const {
    data: kpi,
    isLoading,
    error,
    refetch: refreshKpi,
    isRefetching,
    isError,
  } = useQuery({
    queryKey: ["admin", "Kpi"],
    queryFn: fetchKpi,
    enabled,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    kpi: kpi || [],
    isLoading: isLoading || isRefetching,
    error: error as Error | null,
    refreshKpi,
    isRefetching,
    isError,
  };
};
