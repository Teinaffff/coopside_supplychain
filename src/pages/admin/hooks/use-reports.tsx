import { useQuery } from "@tanstack/react-query";
import { ReportData } from "../../../constants/interface/admin/report";
import toast from "react-hot-toast";
import { reportsMockData } from "../../../common/data/data";

const fetchReports = async () => {
  // const res = await fetch('/api/reports');
  // if (!res.ok) {
  //   const errorData = await res.json();
  //   toast.error(errorData.message ?? 'Failed to fetch reports');
  //   throw new Error(errorData.message ?? 'Failed to fetch reports');
  // }
  // const data = await res.json();
  return reportsMockData;
};

export const useReports = (options?: { isFetchReports: boolean }) => {
  const {
    data: reports,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: fetchReports,
    enabled: options?.isFetchReports,
  });

  return {
    reports,
    isLoading,
    error,
  };
};