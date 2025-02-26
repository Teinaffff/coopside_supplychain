import { useState } from "react";
import { AddEditLeader } from "../../../../constants/interface/pc/leadership";
import { useAppDispatch } from "../../../../store";

export const usePcLeadership = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleAddPcLeadership = (data: AddEditLeader) => {
    try {
      setLoading(true);
      console.log("object: ", data);
      // dispatch(updateLeadershipData(data));
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPcLeadership = (data: AddEditLeader) => {
    try {
      setLoading(true);
      console.log("object: ", data);
      // dispatch(updateLeadershipData(data));
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { handleEditPcLeadership, handleAddPcLeadership, loading };
};
