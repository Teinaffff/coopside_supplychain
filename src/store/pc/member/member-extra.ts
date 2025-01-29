import { createAsyncThunk, Dispatch } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import API from "../../../config/axios-config";
import { getMembers } from "./member-slice";
import { HTTP_RESPONSE } from "../../../constants/general";
import { members } from "../../../common/data/data";

export const getMembersData = createAsyncThunk(
  "members/getmembers",
  async (_, { dispatch }) => {
    try {
      console.log("object", members);
      // const { data } = await API.get("/members");
      // console.log("members", data);
      // if (data) {
      //   dispatch(getmembers(data));
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
      const { status } = await API.put(`/members/${data._id}`, data);
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

export const createMemberData = createAsyncThunk(
  "members/create",
  async (data: any, { dispatch }) => {
    try {
      await API.post(`/members`, data);
      dispatch(getMembersData() as any);
      toast.success("User Added Successfully!");
    } catch (error: any) {
      toast.error(error.message ? error.message : "Something went wrong!");
    }
  }
);

export const deleteMemberData = createAsyncThunk(
  "members/deleteUser",
  async (_id: string, { dispatch }) => {
    try {
      await API.delete(`/members/${_id}`);

      toast.success("User data deleted successfully!");
      dispatch(getMembersData());
    } catch (error: any) {
      toast.error(error.message ? error.message : "Something went wrong!");
    }
  }
);

// export const deletemembers = createAsyncThunk(
//     'members/deleteManymembers',
//     async (ids: string[], { dispatch }) => {
//         try {
//             await API.delete(`/admin/agency/deleteMany`, { data: ids });
//             toast.success('members Deleted Successfully!');
//             dispatch(getmembers());
//         } catch (error: any) {
//             toast.error(error.message ? error.message : 'Something went wrong!');
//         }
//     },
// );

// export const disableAgency = createAsyncThunk(
//     'members/disable',
//     async (_id: string, { dispatch }) => {
//         try {
//             await API.patch(`/admin/agency/disable?id=${_id}`);
//             // dispatch(removeFromAgents(_id));
//             toast.success('Agency disabled successfully!');
//             dispatch(getmembers());
//         } catch (error: any) {
//             toast.error(error.message ? error.message : 'Something went wrong!');
//         }
//     },
// );
