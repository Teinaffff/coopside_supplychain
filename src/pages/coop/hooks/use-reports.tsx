import { useQuery } from "@tanstack/react-query";
import { reportsMockDataCoop } from "../../../common/data/data";
import { Report } from "../../../constants/interface/coop/report";

const fetchReports = async (): Promise<Report[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return reportsMockDataCoop;
};

export const useReports = (isFetchReports?: boolean) => {
  const {
    data: reports = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: fetchReports,
    enabled: isFetchReports,
  });

  return {
    reports,
    isLoading,
    error,
  };
};