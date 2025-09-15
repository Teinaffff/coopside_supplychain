import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LoginFormValues, SignupFormValues } from "../schema/auth";
import { useAppDispatch, useAppSelector } from "../store";
import { createUserData } from "../store/auth/auth-extra";
import { logout } from "../store/auth/auth-slice";

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken, user } = useAppSelector(
    (state) => state.auth
  );

  // Mock login with hard-coded credentials (username: admin, password: password)
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const { username, password } = data;
      await new Promise((res) => setTimeout(res, 500)); // simulate network delay
      if (username === "admin" && password === "password") {
        return { success: true };
      }
      throw new Error("Invalid credentials");
    },
    onSuccess: () => {
      navigate("/coop");
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Invalid login credentials";
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

  const handleLogout = () => {
    dispatch(logout());
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
