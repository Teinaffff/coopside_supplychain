import { createAsyncThunk } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import API from "../../config/axios-config";
import { HTTP_RESPONSE } from "../../constants/general";
import { Login } from "../../constants/interface/auth";
import {
  updateCurrentUser,
  updateTokens,
  updateUser,
  updateUserFields,
  updateUserPhotoField,
  logout,
} from "./auth-slice";

export const createUserData = createAsyncThunk(
  "auth/createUser",
  async (data: any) => {
    try {
      const res = await API.post(`http://10.8.100.39:5005/api/v1/users`, data);
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
      const payload = {
        usernameOrEmail: credentials.username?.trim().replace(/\u00A0/g, ''),
        password: credentials.password?.trim().replace(/\u00A0/g, ''),
      }as const;

      const { status, data } = await API.post(`/v1/auth/login`, payload);
      console.log("[LOGIN RESPONSE]", status, data);

      // Be tolerant to varying backend shapes
      const container = (data?.data ?? data) as any;
      const accessToken = container?.accessToken || container?.token || container?.access;
      const refreshToken = container?.refreshToken || container?.refresh;

      if (accessToken) {
        // Update current user if provided
        const username = container?.username || container?.user?.username || container?.userName;
        const userType = container?.userType || container?.role || container?.user?.role;
        if (username || userType) {
          dispatch(
            updateCurrentUser({
              username,
              userType,
            })
          );
        }

        // Save tokens to redux and localStorage for now
        dispatch(
          updateTokens({
            accessToken,
            refreshToken,
          })
        );

        try {
          localStorage.setItem("accessToken", accessToken);
          if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        } catch {}

        return data;
      }

      const serverMessage = (data as any)?.message || (data as any)?.error || "Login Request Failed!";
      throw new Error(serverMessage);
    } catch (error: any) {
      console.log("[LOGIN ERROR]", error?.response?.data || error?.message);
      throw error;
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string, { dispatch }) => {
    try {
      const { status, data } = await API.post(`/v1/auth/refresh-token`, {
        refreshToken,
      });

      if (status === HTTP_RESPONSE.SUCCESS && data?.data?.accessToken) {
        dispatch(
          updateTokens({
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken ?? refreshToken,
          })
        );
        return data;
      } else {
        throw new Error(data?.message || "Refresh token failed");
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


export const logoutUser = createAsyncThunk(
  "auth/logoutApi",
  async (_: void, { dispatch }) => {
    try {
      await API.post(`/v1/auth/logout`);
    } catch (error) {
      
      console.warn("[LOGOUT API ERROR]", (error as any)?.response?.data || (error as any)?.message);
    } finally {
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } catch {}
      dispatch(logout());
    }
  }
);
