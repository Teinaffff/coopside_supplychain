import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../constants/interface/auth";
import { authInitialState } from "../initialStates";

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    updateUser(state, { payload }: PayloadAction<User | undefined>) {
      state.user = payload;
    },
    updateTokens(
      state,
      { payload }: PayloadAction<{ accessToken: string; refreshToken?: string }>
    ) {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.isAuthenticated = true;
    },
    updateUserFields(
      state,
      { payload }: PayloadAction<{ email: string; name: string; bio: string }>
    ) {
      if (state.user) {
        // state.user.email = payload.email ?? state.user.email;
        // state.user.name = payload.name ?? state.user.name;
        // state.user.bio = payload.bio ?? state.user.bio;
      }
    },
    updateUserPhotoField(state, { payload }: PayloadAction<{ photo: string }>) {
      if (state.user) {
        // state.user.photo = payload.photo ?? state.user.photo;
      }
    },
    logout(state) {
      state.user = undefined;
      state.accessToken = undefined;
      state.refreshToken = undefined;
      state.isAuthenticated = false;
    },
  },
});

export const {
  updateUser,
  updateUserFields,
  updateUserPhotoField,
  updateTokens,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
