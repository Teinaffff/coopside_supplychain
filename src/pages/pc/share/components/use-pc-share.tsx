import { useState } from "react";
import { Share } from "../../../../constants/interface/pc/share";
import { useAppDispatch } from "../../../../store";

export const usePcShare = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleAddPcShare = (data: Share) => {
    try {
      setLoading(true);
      console.log(data);
      // dispatch(createShareData(data));
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPcShare = (data: Share) => {
    try {
      setLoading(true);
      console.log(data);
      // dispatch(updateShareData(data));
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    handleAddPcShare,
    handleEditPcShare,
    loading,
  };
};
