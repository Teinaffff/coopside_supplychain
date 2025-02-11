import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LoginFormValues, SignupFormValues } from "../constants/schema";
import { useAppDispatch } from "../store";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      // await dispatch(authenticate(data));
      // Add your authentication logic here
      navigate("/dashboard");
    } catch (error) {
      const errors = error as AxiosError;
      if (errors.message === "Please check your username and password.") {
        toast.error("Invalid username or password");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormValues) => {
    try {
      setLoading(true);
      // await dispatch(register(data));
      // Add your registration logic here
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      const errors = error as AxiosError;
      if (errors.message === "Email already exists") {
        toast.error("Email is already registered");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogin,
    handleSignup,
  };
};
