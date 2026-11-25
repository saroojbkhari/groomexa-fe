import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ESessionStatus, type IAuthUser } from "@/typings/auth";

/**
 * Client-side auth state only. Request state (loading, errors, responses) lives in RTK Query (authQuery.ts).
 * Updated by containers/SessionProvider whenever utils/storage starts or ends a session.
 */
export interface State {
  status: ESessionStatus;
  /** The logged-in user, from the latest login or refresh response. */
  user: IAuthUser | null;
}

export const initialState: State = {
  status: ESessionStatus.Unknown,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** A user = logged in; null = logged out. */
    setUser: (state, action: PayloadAction<IAuthUser | null>) => {
      state.user = action.payload;
      state.status = action.payload ? ESessionStatus.Authenticated : ESessionStatus.Anonymous;
    },
  },
});

export default authSlice;
export const { setUser } = authSlice.actions;
