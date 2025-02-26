import { useState } from "react";
import toast from "react-hot-toast";
import { AdminFormValues, PcFormValues } from "../schema/pc/profile";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store";

export const useProfileChange = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [isEditablePc, setIsEditablePc] = useState(false);
  const [loading, setLoading] = useState(false);

  // const token = localStorage.getItem("token");
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwOTEyMDc4NjQwIiwicm9sZSI6IkZBUk1FUiIsImV4cCI6MTcwNzE2MzMzNiwiaWF0IjoxNzA3MTIwMTM2LCJ1c2VySWQiOjEwNTIsImF1dGhvcml0aWVzIjpbImxvYW5fYXBwbGljYXRpb24iLCJyZWdpc3Rlcl9sYW5kX2FyZWEiXX0.MNk651WSwYfIegG9L9NIotbvzxJEvf_jJLMweggvVz8";

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: AdminFormValues) => {
    try {
      setLoading(true);
      setIsEditable(false);
      console.log(data);
    } catch (error: any) {
      if (error.message === "Network error: Unable to connect to the server.") {
        toast.error("Network error: Unable to connect to the server");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPc = async (data: PcFormValues) => {
    try {
      setLoading(true);
      setIsEditablePc(false);
    } catch (error: any) {
      if (error.message === "Network error: Unable to connect to the server.") {
        toast.error("Network error: Unable to connect to the server");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    isEditable,
    isEditablePc,
    setIsEditable,
    setIsEditablePc,
    onSubmit,
    onSubmitPc,
  };
};
