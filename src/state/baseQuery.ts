import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { AxiosRequestConfig } from "axios";
import { ApiError } from "@/middlewares/errorHandler";
import type { IApiError } from "@/typings/common";
import { createInstance } from "@/utils/fetch";

/** What an endpoint's `query` returns: a URL string (GET), or the full request. */
export interface IRequestArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  body?: unknown;
  params?: AxiosRequestConfig["params"];
  /** Public endpoints (login, register, …): no token, and a 401 isn't "session expired". */
  skipAuth?: boolean;
}

/** One axios instance with our interceptors (token, refresh + retry, ApiError). URLs are relative to API_URL. */
const http = createInstance();

/**
 * RTK Query's default is `fetchBaseQuery` (uses fetch). We plug in axios instead so the interceptors in
 * utils/fetch.ts keep working. On failure RTK Query puts the returned `error` (a plain IApiError) in the
 * hook's `error` and in the rejected action's `payload` (which middlewares/errorHandler.ts reads).
 */
const axiosBaseQuery: BaseQueryFn<string | IRequestArgs, unknown, IApiError> = async (args) => {
  const { url, method = "GET", body, params, skipAuth } = typeof args === "string" ? { url: args } : args;
  try {
    const { data } = await http.request({ url, method, data: body, params, skipAuth });
    return { data };
  } catch (err) {
    return { error: ApiError.from(err).toJSON() };
  }
};

/**
 * The one API object for the whole app. Features don't edit this file: they add their endpoints with
 * `baseApi.injectEndpoints(...)` in `state/<feature>/<feature>Query.ts` (see state/auth/authQuery.ts).
 */
export const baseApi = createApi({
  reducerPath: "groomexaApi",
  baseQuery: axiosBaseQuery,
  // Cache tags for GET queries go here as features need them, e.g. "Clients", "Appointments".
  tagTypes: [],
  endpoints: () => ({}),
});
