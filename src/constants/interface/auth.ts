export interface ChangePasswordProps {
    password: string;
    oldPassword: string;
    userId?:string
  }
  
  export interface ForgotPasswordProps {
    username: string;
  }
  
  export interface LoginResponse {
    access_token: string;
    refresh_token: string;
  }
  
  export interface Login {
    email: string;
    password: string;
  }

  export interface AuthSliceType {
    user?: User;
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