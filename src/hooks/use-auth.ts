import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LoginFormValues, SignupFormValues } from "../schema/auth";
import { useAppDispatch, useAppSelector } from "../store";
import { createUserData, authenticate, logoutUser } from "../store/auth/auth-extra";

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken, user } = useAppSelector(
    (state) => state.auth
  );

  // Real login using backend API
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await dispatch(authenticate(data) as any);
      // unwrap result (RTK) if available
      if ((res as any)?.error) {
        throw new Error((res as any)?.error?.message || "Login failed");
      }
      return (res as any)?.payload ?? res;
    },
    onSuccess: () => {
      navigate("/coop");
      toast.success("Logged in successfully");
    },
    onError: (error: any) => {
      const serverMsg = error?.response?.data?.message || error?.message;
      const errorMessage = serverMsg || "Invalid login credentials";
      // console surface
      // eslint-disable-next-line no-console
      console.error("[LOGIN ERROR UI]", errorMessage, error?.response?.data);
      toast.error(errorMessage);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupFormValues) => dispatch(createUserData(data)),
    onSuccess: () => {
      toast.success("Registration successful! Please login.");
      navigate("/login");
    },
    onError: (error: any) => {
      if (error.message === "Email already exists") {
        toast.error("Email is already registered");
      } else {
        toast.error("Something went wrong!");
      }
    },
  });

  const handleLogout = async () => {
    await dispatch(logoutUser() as any);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return {
    loading: loginMutation.isPending || signupMutation.isPending,
    isAuthenticated,
    accessToken,
    user,
    handleLogin: loginMutation.mutate,
    handleSignup: signupMutation.mutate,
    handleLogout,
  };
};
