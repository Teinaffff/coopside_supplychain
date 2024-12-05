import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userInitialState } from "../initialStates.ts";
import { User } from "../../constants/interface/user.ts";

const userSlice = createSlice({
  name: "users",
  initialState: userInitialState,
  reducers: {
    getUsers: (state, { payload }: PayloadAction<User[]>) => {
      state.usersList = payload;
    },
  },
});

export const { getUsers } = userSlice.actions;
export default userSlice.reducer;
