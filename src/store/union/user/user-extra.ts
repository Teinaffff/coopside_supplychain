import { createAsyncThunk, Dispatch } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import API from "../../../config/axios-config";
import { getMembers } from "./user-slice";
import { HTTP_RESPONSE } from "../../../constants/general";
import { members } from "../../../common/data/data";

export const getMembersData = createAsyncThunk(
  "Members/getMembers",
  async (_, { dispatch }) => {
    try {
      console.log("object", members);
      // const { data } = await API.get("/Members");
      // console.log("Members", data);
      // if (data) {
      //   dispatch(getMembers(data));
      // }
      // return data ?? [];

      if (members) {
        dispatch(getMembers(members));
      }
      return members ?? [];
    } catch (error: any) {
      toast.error("Something went wrong!");
    }
  }
);

export const updateMembersData = (data: any) => {
  return async (dispatch: Dispatch) => {
    try {
      console.log("data from extra", data);
      const { status } = await API.put(`/Members/${data._id}`, data);
      status === HTTP_RESPONSE.UPDATED
        ? dispatch(getMembersData() as any)
        : toast.success("Something went wrong!");
      dispatch(getMembersData() as any);
      toast.success("User Updated Successfully!");
    } catch (error: any) {
      toast.error(error.message ? error.message : "Something went wrong!");
    }
  };
};

export const createUserData = createAsyncThunk(
  "Members/create",
  async (data: any, { dispatch }) => {
    try {
      await API.post(`/Members`, data);
      dispatch(getMembersData() as any);
      toast.success("User Added Successfully!");
    } catch (error: any) {
      toast.error(error.message ? error.message : "Something went wrong!");
    }
  }
);

export const deleteUserData = createAsyncThunk(
  "Members/deleteUser",
  async (_id: string, { dispatch }) => {
    try {
      await API.delete(`/Members/${_id}`);

      toast.success("User data deleted successfully!");
      dispatch(getMembersData());
    } catch (error: any) {
      toast.error(error.message ? error.message : "Something went wrong!");
    }
  }
);

// export const deleteMembers = createAsyncThunk(
//     'Members/deleteManyMembers',
//     async (ids: string[], { dispatch }) => {
//         try {
//             await API.delete(`/admin/agency/deleteMany`, { data: ids });
//             toast.success('Members Deleted Successfully!');
//             dispatch(getMembers());
//         } catch (error: any) {
//             toast.error(error.message ? error.message : 'Something went wrong!');
//         }
//     },
// );

// export const disableAgency = createAsyncThunk(
//     'Members/disable',
//     async (_id: string, { dispatch }) => {
//         try {
//             await API.patch(`/admin/agency/disable?id=${_id}`);
//             // dispatch(removeFromAgents(_id));
//             toast.success('Agency disabled successfully!');
//             dispatch(getMembers());
//         } catch (error: any) {
//             toast.error(error.message ? error.message : 'Something went wrong!');
//         }
//     },
// );
