import { useQuery } from "@tanstack/react-query";

import { useSelector } from "react-redux";
import { paymentsMockData } from "../../../common/data/data";
import { RootState } from "../../../store";

const fetchPayments = async (accessToken: string) => {
  // const res = await fetch(`${baseUrl}/orders`, {
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  // });
  // if (!res.ok) {
  //   const errorData = await res.json();
  //   toast.error(errorData.message ?? "Failed to fetch orders");
  //   throw new Error(errorData.message ?? "Failed to fetch orders");
  // }
  // const data = await res.json();
  // return data.data ?? [];
  return paymentsMockData;
};

// React Query hooks
export const usePayments = (options?: { isFetchPayments?: boolean }) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const {
    data: payments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payments"],
    queryFn: () => fetchPayments(accessToken ?? ""),
    staleTime: 5 * 60 * 1000, 
    enabled: options?.isFetchPayments,
  });

  return {
    payments,
    isLoading,
    error,
  };
};
