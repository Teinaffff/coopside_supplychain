import { useState } from "react";
import { useAppDispatch } from "../../../store";

export const usePcBankRequest = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleSendPcBankRequest = (data: { purpose: string }) => {
    try {
      setLoading(true);
      console.log(data);
      // dispatch(createbankRequestData(data));
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSendPcBankRequest,
    loading,
  };
};
