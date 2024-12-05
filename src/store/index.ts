import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore, createSelector } from "@reduxjs/toolkit";
import user from "./user/user-slice";

const store = configureStore({
  reducer: {
    user,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const createAppSelector = createSelector.withTypes<RootState>();
export default store;
