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
  currentUser?: CurrentUser;
  accessToken?: string;
  refreshToken?: string;
  isAuthenticated: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profile_pic?: string;
  role: string;
  bio?: string;
  photo?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUser {
  username: string;
  userType: string;
}
