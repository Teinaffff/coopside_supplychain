import { createAsyncThunk, Dispatch } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import API from "../../config/axios-config";
import { getUsers } from "./user-slice";
import { HTTP_RESPONSE } from "../../constants/general";

export const getUsersData = createAsyncThunk(
  "users/getusers",
  async (_, { dispatch }) => {
    try {
      const { data } = await API.get("/users");
      console.log("users", data);
      if (data) {
        dispatch(getUsers(data));
      }
      return data ?? [];
    } catch (error: any) {
      toast.error("Something went wrong!");
    }
  }
);

export const updateUsersData = (data: any) => {
  return async (dispatch: Dispatch) => {
    try {
      console.log("data from extra", data);
      const { status } = await API.put(`/users/${data._id}`, data);
      status === HTTP_RESPONSE.UPDATED
        ? dispatch(getUsersData() as any)
        : toast.success("Something went wrong!");
      dispatch(getUsersData() as any);
      toast.success("User Updated Successfully!");
    } catch (error: any) {
      toast.error(error.message ? error.message : "Something went wrong!");
    }
  };
};

export const createUserData = createAsyncThunk(
    'users/create',
    async (data: any, { dispatch }) => {
        try {
            await API.post(`/users`, data);
            dispatch(getUsersData() as any);
            toast.success('User Added Successfully!');
        } catch (error: any) {
            toast.error(error.message ? error.message : 'Something went wrong!');
        }
    },
);

export const deleteUserData = createAsyncThunk(
  "users/deleteUser",
  async (_id: string, { dispatch }) => {
    try {
      await API.delete(`/users/${_id}`);

      toast.success("User data deleted successfully!");
      dispatch(getUsersData());
    } catch (error: any) {
      toast.error(error.message ? error.message : "Something went wrong!");
    }
  }
);

// export const deleteusers = createAsyncThunk(
//     'users/deleteManyusers',
//     async (ids: string[], { dispatch }) => {
//         try {
//             await API.delete(`/admin/agency/deleteMany`, { data: ids });
//             toast.success('users Deleted Successfully!');
//             dispatch(getusers());
//         } catch (error: any) {
//             toast.error(error.message ? error.message : 'Something went wrong!');
//         }
//     },
// );

// export const disableAgency = createAsyncThunk(
//     'users/disable',
//     async (_id: string, { dispatch }) => {
//         try {
//             await API.patch(`/admin/agency/disable?id=${_id}`);
//             // dispatch(removeFromAgents(_id));
//             toast.success('Agency disabled successfully!');
//             dispatch(getusers());
//         } catch (error: any) {
//             toast.error(error.message ? error.message : 'Something went wrong!');
//         }
//     },
// );
