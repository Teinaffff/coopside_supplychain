import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Member } from "../../../constants/interface/pc/members.ts";
import { PcMemberInitialState } from "../../initialStates.ts";

const memberSlice = createSlice({
  name: "members",
  initialState: PcMemberInitialState,
  reducers: {
    getMembers: (state, { payload }: PayloadAction<Member[]>) => {
      state.membersList = payload;
    },
  },
});

export const { getMembers } = memberSlice.actions;
export default memberSlice.reducer;
