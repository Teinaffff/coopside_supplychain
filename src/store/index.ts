import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore, createSelector } from "@reduxjs/toolkit";
import member from "./pc/member/member-slice";
import notification from "./notification/notification-slice";
import auth from "./auth/auth-slice";

const store = configureStore({
  reducer: {
    member,
    notification,
    auth,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const createAppSelector = createSelector.withTypes<RootState>();
export default store;
