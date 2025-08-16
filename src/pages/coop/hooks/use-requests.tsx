import { useQuery } from "@tanstack/react-query";
import { requestsMockData } from "../../../common/data/data";
import { Request } from "../../../constants/interface/coop/request";

const fetchRequests = async (): Promise<Request[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return requestsMockData;
};

export const useRequests = (isFetchRequests?: boolean) => {
  const {
    data: requests = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["requests"],
    queryFn: fetchRequests,
    enabled: isFetchRequests,
  });

  return {
    requests,
    isLoading,
    error,
  };
};