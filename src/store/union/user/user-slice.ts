import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../constants/interface/union/members.ts";
import { UnionUserInitialState } from "../../initialStates.ts";

const userSlice = createSlice({
  name: "users",
  initialState: UnionUserInitialState,
  reducers: {
    getUsers: (state, { payload }: PayloadAction<User[]>) => {
      state.usersList = payload;
    },
  },
});

export const { getUsers } = userSlice.actions;
export default userSlice.reducer;
