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
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: (error: AxiosError) => {
      if (error.message === "Please check your username and password.") {
        toast.error("Invalid username or password");
      } else {
        toast.error("Something went wrong!");
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
