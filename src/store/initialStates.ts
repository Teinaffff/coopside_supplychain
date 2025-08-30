import { AuthSliceType } from "../constants/interface/auth";

export const authInitialState: AuthSliceType = {
  isAuthenticated: false,
  accessToken: undefined,
  refreshToken: undefined,
  user: undefined,
};
