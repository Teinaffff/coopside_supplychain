import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../constants/interface/pc/members.ts";
import { PcUserInitialState } from "../../initialStates.ts";

const userSlice = createSlice({
  name: "users",
  initialState: PcUserInitialState,
  reducers: {
    getUsers: (state, { payload }: PayloadAction<User[]>) => {
      state.usersList = payload;
    },
  },
});

export const { getUsers } = userSlice.actions;
export default userSlice.reducer;
