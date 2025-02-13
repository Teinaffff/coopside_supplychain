import { AuthSliceType } from "../constants/interface/auth";
import { PCMemberSliceType } from "../constants/interface/pc/members";
import { UnionMemberSliceType } from "../constants/interface/union/members";

export const authInitialState: AuthSliceType = {};

export const PcMemberInitialState: PCMemberSliceType = {
  membersList: [],
};
export const UnionMemberInitialState: UnionMemberSliceType = {
  membersList: [],
};
