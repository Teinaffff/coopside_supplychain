import { useState } from "react";
import { Member } from "../../../constants/interface/pc/members";
import { useAppDispatch } from "../../../store";
import {
  createMemberData,
  updateMembersData,
} from "../../../store/pc/member/member-extra";

export const usePcMembers = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleAddMember = (data: Member) => {
    try {
      setLoading(true);
      console.log(data);
      dispatch(createMemberData(data));
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMember = (data: Member) => {
    try {
      setLoading(true);
      console.log(data);
      dispatch(updateMembersData(data));
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleEditMember, handleAddMember };
};
