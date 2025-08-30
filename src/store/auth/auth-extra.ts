import { createAsyncThunk } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import API from "../../config/axios-config";
import { HTTP_RESPONSE } from "../../constants/general";
import { Login } from "../../constants/interface/auth";
import {
  updateTokens,
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
        throw new Error(message);
      } else {
        return newData;
      }
    } catch (error: any) {
      throw error;
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "auth/changePassword",
  async (userData: any, { dispatch }) => {
    try {
      const { status, data } = await API.patch(
        `/auth/updateMyPassword`,
        userData
      );
      if (status === HTTP_RESPONSE.SUCCESS && data.data?.accessToken) {
        dispatch(updateUser(data.user));
        dispatch(
          updateTokens({
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          })
        );

        return data;
      } else {
        throw new Error("Reset Password Failed!");
      }
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
);

export const forgotUserPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string) => {
    try {
      const { status, data } = await API.post(`/auth/forgotPassword`, {
        email,
      });
      if (status === HTTP_RESPONSE.SUCCESS) {
        return data;
      } else {
        throw new Error("Reset Password Failed!");
      }
    } catch (error: any) {
      console.log(error);
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
      const { status, data } = await API.patch(`/auth/resetPassword/${token}`, {
        password,
      });
      if (status === HTTP_RESPONSE.SUCCESS) {
        navigate("/login");
        return data;
      } else {
        throw new Error("Reset Password Failed!");
      }
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
);

export const authenticate = createAsyncThunk(
  "auth/login",
  async (credentials: Login, { dispatch }) => {
    try {
      const { status, data } = await API.post(`/auth/login`, credentials);

      if (status === HTTP_RESPONSE.SUCCESS && data.success) {
        // Update current user
        dispatch(
          updateUser({
            username: data.data.username,
            userType: data.data.userType,
          })
        );

        // Update tokens (redux-persist will handle storage)
        dispatch(
          updateTokens({
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          })
        );

        return data;
      } else {
        const errorMessage = data.message || "Login Request Failed!";
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.log(error);
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
      const { status, data } = await API.patch(`/me/edit`, {
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

        dispatch(updateUserFields(updatedFields));
        return data;
      } else {
        throw new Error("Profile Update Failed!");
      }
    } catch (error: any) {
      console.log(error);
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
        `/me/avatar/${newData.userId}/photo`,
        formData
      );
      if (status === HTTP_RESPONSE.SUCCESS) {
        dispatch(updateUserPhotoField({ photo: data.data.adminUser.photo }));
        return data.data.adminUser.photo;
      } else {
        throw new Error("Image Update Failed!");
      }
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
);
