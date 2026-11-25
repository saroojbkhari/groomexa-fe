import { combineReducers, configureStore } from "@reduxjs/toolkit";
import errorHandler from "@/middlewares/errorHandler";
import authSlice from "@/state/auth/slice";
import { baseApi } from "@/state/baseQuery";

/**
 * Combined once, when this file loads. (combineReducers runs a self-check that uses Math.random(); doing it here
 * instead of inside makeStore keeps that out of rendering, which Next.js's prerendering doesn't allow.)
 */
const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer, // RTK Query's cache and request state
  auth: authSlice.reducer,
});

/**
 * Next.js renders client components on the server too, and one server handles many users.
 * A single module-level `store` would be shared between them, so we export a factory and
 * create one store per browser tab in containers/StoreProvider.tsx (Redux's recommended Next.js setup).
 */
export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware).concat(errorHandler),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
