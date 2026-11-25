import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";
import { API_URL, DEFAULT_TIMEOUT } from "@/constants/network";
import { REFRESH_LOCK } from "@/constants/storage";
import { ApiError, AuthError } from "@/middlewares/errorHandler";
import type { IAuthTokensResponse } from "@/typings/auth";
import storage from "./storage";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Public endpoint (login, register, logout…): no token, and a 401 there isn't "session expired". */
    skipAuth?: boolean;
    /** Internal: set once a request has been retried after a token refresh. */
    _retry?: boolean;
  }
}

/** Creates an axios instance with our two interceptors. Used by RTK Query's base query (state/baseQuery.ts). */
export function createInstance(config: AxiosRequestConfig = {}): AxiosInstance {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    ...config,
  });

  /** Request interceptor: attach `Authorization: Bearer <access token>` when we have one in memory. */
  instance.interceptors.request.use((requestConfig) => {
    const token = storage.getAccessToken();
    if (token && !requestConfig.skipAuth) {
      requestConfig.headers.set("Authorization", `Bearer ${token}`);
    }
    return requestConfig;
  });

  /**
   * Response interceptor:
   * 1. 401 on a logged-in request → refresh the session once, then retry the request once.
   *    Still 401, or the refresh says the session is over → AuthError (middlewares/errorHandler.ts ends the session).
   * 2. Every other failure → ApiError, with a message that's safe to show.
   */
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config;
      if (error.response?.status === 401 && original && !original.skipAuth) {
        if (original._retry) return Promise.reject(new AuthError());
        original._retry = true;
        if (await refreshSession()) return instance(original); // the request interceptor adds the new token
        // doRefresh() removes the refresh token when the backend rejects it. If it's still there,
        // the refresh failed for another reason (offline, rate limited): keep the session, report the error.
        if (storage.getRefreshToken()) return Promise.reject(new ApiError(0, "REFRESH_FAILED", "We couldn't reach the server. Please try again."));
        return Promise.reject(new AuthError());
      }
      return Promise.reject(ApiError.from(error));
    },
  );

  return instance;
}

/**
 * One refresh, with the latest refresh token. Runs inside the cross-tab lock, so the token is read HERE:
 * another tab may have rotated it while we waited.
 */
async function doRefresh(): Promise<boolean> {
  const refreshToken = storage.getRefreshToken();
  if (!refreshToken) return false;
  try {
    // Plain axios, not our instance: this call must never trigger the 401 → refresh logic itself.
    const { data } = await axios.post<IAuthTokensResponse>(`${API_URL}/auth/refresh`, { refreshToken }, { timeout: DEFAULT_TIMEOUT });
    storage.setSession(data); // store the NEW refresh token right away: the old one is used up
    return true;
  } catch (err) {
    // INVALID_REFRESH_TOKEN: the session is over. Only clear it if no other tab rotated it meanwhile.
    if (axios.isAxiosError(err) && err.response?.status === 401 && storage.getRefreshToken() === refreshToken) {
      storage.clearSession();
    }
    return false;
  }
}

let refreshing: Promise<boolean> | null = null;

/**
 * Gets a new access token (and a new refresh token). Resolves true on success.
 *
 * Refresh tokens are single use, and the backend treats a reused one as theft (it ends the login on that device).
 * So refreshes must never overlap:
 * - in this tab: every caller waits for the same `refreshing` promise;
 * - across tabs: a Web Lock lets one tab refresh at a time (they all share the token in localStorage).
 */
export function refreshSession(): Promise<boolean> {
  refreshing ??= withRefreshLock().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

/** Runs doRefresh() while holding the cross-tab lock (released when it settles). Older browsers: no lock. */
async function withRefreshLock(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.locks) return doRefresh();
  return await navigator.locks.request(REFRESH_LOCK, doRefresh);
}
