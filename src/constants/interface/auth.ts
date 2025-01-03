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