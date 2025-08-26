import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LoginFormValues, SignupFormValues } from "../schema/auth";
import { useAppDispatch, useAppSelector } from "../store";
import { authenticate, createUserData } from "../store/auth/auth-extra";
import { logout } from "../store/auth/auth-slice";

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken, user } = useAppSelector(
    (state) => state.auth
  );

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => dispatch(authenticate(data)),
    onSuccess: (response: any) => {
      if (response?.payload?.success) {
        navigate("/admin");
      }
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.message;

      if (error.response?.status === 400) {
        if (
          errorMessage === "Invalid credentials" ||
          errorMessage?.includes("credentials")
        ) {
          toast.error("Invalid username or password");
        } else {
          toast.error(errorMessage || "Invalid login credentials");
        }
      } else {
        toast.error(errorMessage || "Something went wrong! Please try again.");
      }
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupFormValues) => dispatch(createUserData(data)),
    onSuccess: () => {
      toast.success("Registration successful! Please login.");
      navigate("/login");
    },
    onError: (error: AxiosError) => {
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
