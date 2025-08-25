import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";
import API from "../../config/axios-config";
import { HTTP_RESPONSE, TOKEN, USER } from "../../constants/general";
import { Login } from "../../constants/interface/auth";
import {
  updateUser,
  updateUserFields,
  updateUserPhotoField,
} from "./auth-slice";

export const createUserData = createAsyncThunk(
  "auth/createUser",
  async (data: any) => {
    try {
      const res = await API.post(`admin/user/add`, data);
      const newData = await res.data;
      if (newData.status === "fail") {
        const message = newData.message
          ? newData.message
          : "Adding User Request Failed!";
        toast.error(message);
        throw new Error(message);
      } else {
        toast.success("User Added Successfully!");
        return newData;
      }
    } catch (error: any) {
      const message = error.message ? error.message : "Adding User Failed!";
      toast.error(message);
      throw error;
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "auth/changePassword",
  async (userData: any, { dispatch }) => {
    try {
      const { status, data } = await API.patch(
        `/admin/auth/updateMyPassword`,
        userData
      );
      if (status === HTTP_RESPONSE.SUCCESS && data.token) {
        dispatch(updateUser(data.user));
        localStorage.setItem(TOKEN, data.token);
        localStorage.setItem(USER, JSON.stringify(data.user));
        toast.success("Password Changed Successfully!");
        return data;
      } else {
        toast.error("Reset Password Failed!");
        throw new Error("Reset Password Failed!");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Reset Password Failed!");
      throw error;
    }
  }
);

export const forgotUserPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string) => {
    try {
      const { status, data } = await API.post(`/admin/auth/forgotPassword`, {
        email,
      });
      if (status === HTTP_RESPONSE.SUCCESS) {
        toast.success(
          data.message ?? "Password Reset Email Sent Successfully!"
        );
        return data;
      } else {
        toast.error("Reset Password Failed!");
        throw new Error("Reset Password Failed!");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Reset Password Failed!");
      throw error;
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({
    password,
    token,
    navigate,
  }: {
    password: string;
    token: string;
    navigate: NavigateFunction;
  }) => {
    try {
      const { status, data } = await API.patch(
        `/admin/auth/resetPassword/${token}`,
        {
          password,
        }
      );
      if (status === HTTP_RESPONSE.SUCCESS) {
        toast.success(data.message ?? "Password Changed Successfully!");
        navigate("/login");
        return data;
      } else {
        toast.error("Reset Password Failed!");
        throw new Error("Reset Password Failed!");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Reset Password Failed!");
      throw error;
    }
  }
);

export const authenticate = createAsyncThunk(
  "auth/login",
  async (credentials: Login, { dispatch }) => {
    try {
      const { status, data } = await API.post(`/admin/auth/login`, credentials);
      if (status === HTTP_RESPONSE.SUCCESS && data.token) {
        dispatch(updateUser(data.user));
        localStorage.setItem(TOKEN, data.token);
        localStorage.setItem(USER, JSON.stringify(data.user));
        toast.success("Login success");
        return data;
      } else {
        toast.error("Login Request Failed!");
        throw new Error("Login Request Failed!");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Login Request Failed!");
      throw error;
    }
  }
);

export const UpdateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    newData: {
      email: string;
      fullName: string;
      bio: string;
      userId: string;
    },
    { dispatch }
  ) => {
    try {
      const { status, data } = await API.patch(`/admin/me/edit`, {
        email: newData.email,
        name: newData.fullName,
        bio: newData.bio,
        userId: newData.userId,
      });
      if (status === HTTP_RESPONSE.SUCCESS) {
        // Merge existing user data with the new fields
        const updatedFields = {
          email: newData.email,
          name: newData.fullName,
          bio: newData.bio,
        };

        // Dispatch the updateUser action with the merged data
        dispatch(updateUserFields(updatedFields));
        // Get the existing user data from local storage
        const existingUserData = JSON.parse(localStorage.getItem(USER) || "{}");

        // Merge the existing data with the new fields
        const updatedUserData = {
          ...existingUserData,
          ...updatedFields,
        };

        // Save the updated user data back to local storage
        localStorage.setItem(USER, JSON.stringify(updatedUserData));
        toast.success(data.message ?? "Profile Updated Successfully!");
        return data;
      } else {
        toast.error("Profile Update Failed!");
        throw new Error("Profile Update Failed!");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Profile Update Failed!");
      throw error;
    }
  }
);

export const UpdateProfileImage = createAsyncThunk(
  "auth/updateProfileImage",
  async (
    newData: {
      photo: File;
      userId: string;
    },
    { dispatch }
  ) => {
    try {
      const formData = new FormData();
      formData.append("photo", newData.photo);

      const { status, data } = await API.put(
        `/admin/me/avatar/${newData.userId}/photo`,
        formData
      );
      if (status === HTTP_RESPONSE.SUCCESS) {
        dispatch(updateUserPhotoField({ photo: data.data.adminUser.photo }));
        localStorage.setItem(USER, JSON.stringify(data.data.adminUser));
        toast.success(data.message ?? "Image Updated Successfully!");
        return data.data.adminUser.photo;
      } else {
        toast.error("Image Update Failed!");
        throw new Error("Image Update Failed!");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Image Update Failed!");
      throw error;
    }
  }
);
