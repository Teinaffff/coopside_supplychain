import { useState } from "react";
import { useAppDispatch } from "../../../store";

export const usePcRequest = () => {
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

  const handleSendPcLogoRequest = (data: {
    purpose: string;
    logo: File | null;
  }) => {
    try {
      setLoading(true);
      console.log(data);
      // dispatch(createLogoRequestData(data));
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSendPcBankRequest,
    handleSendPcLogoRequest,
    loading,
  };
};
