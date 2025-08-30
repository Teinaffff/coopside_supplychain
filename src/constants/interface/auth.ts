export interface ChangePasswordProps {
  password: string;
  oldPassword: string;
  userId?: string;
}

export interface ForgotPasswordProps {
  username: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface Login {
  username: string;
  password: string;
}

export interface AuthSliceType {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  isAuthenticated: boolean;
}

export interface User {
  username: string;
  userType: string;
}
