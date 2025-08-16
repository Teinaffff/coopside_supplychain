import { useQuery } from "@tanstack/react-query";
import { logsMockData } from "../../../common/data/data";

interface UseLogsProps {
  enabled?: boolean;
}

const fetchLogs = async () => {
  // Example: const response = await axios.get('/api/admin/logs');
  // return response.data;

  return logsMockData;
};

export const useLogs = ({ enabled = true }: UseLogsProps = {}) => {
  const {
    data: logs,
    isLoading,
    error,
    refetch: refreshLogs,
    isRefetching,
    isError,
  } = useQuery({
    queryKey: ["admin", "logs"],
    queryFn: fetchLogs,
    enabled,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    logs: logs || [],
    isLoading: isLoading || isRefetching,
    error: error as Error | null,
    refreshLogs,
    isRefetching,
    isError,
  };
};
