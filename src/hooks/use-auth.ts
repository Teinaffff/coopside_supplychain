import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LoginFormValues, SignupFormValues } from "../schema/auth";
import { useAppDispatch } from "../store";
import { authenticate, createUserData } from "../store/auth/auth-extra";

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => dispatch(authenticate(data)),
    onSuccess: (response: any) => {
      if (response?.payload?.success) {
        toast.success(response.payload.message || "Login successful!");
        navigate("/admin");
      } else {
        toast.error("Login failed. Please try again.");
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
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized access. Please check your credentials.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
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

  return {
    loading: loginMutation.isPending || signupMutation.isPending,
    handleLogin: loginMutation.mutate,
    handleSignup: signupMutation.mutate,
  };
};
