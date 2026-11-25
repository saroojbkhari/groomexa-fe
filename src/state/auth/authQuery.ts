import { baseApi } from "@/state/baseQuery";
import type {
  IAuthTokensResponse,
  ILoginPayload,
  IMessageResponse,
  IRegisterPayload,
  IResetPasswordPayload,
} from "@/typings/auth";

/**
 * Auth endpoints (all POST). Every one changes something on the server, so they're all mutations.
 * All are public (`skipAuth: true`) except logout-all, which needs the access token.
 * /auth/refresh isn't here: it's called only by refreshSession() in utils/fetch.ts.
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<IMessageResponse, IRegisterPayload>({
      query: (payload) => ({ url: "/auth/register", method: "POST", body: payload, skipAuth: true }),
    }),

    verifyEmail: build.mutation<IMessageResponse, string>({
      query: (token) => ({ url: "/auth/verify-email", method: "POST", body: { token }, skipAuth: true }),
    }),

    resendVerification: build.mutation<IMessageResponse, string>({
      query: (email) => ({ url: "/auth/verify-email/resend", method: "POST", body: { email }, skipAuth: true }),
    }),

    login: build.mutation<IAuthTokensResponse, ILoginPayload>({
      query: (payload) => ({ url: "/auth/login", method: "POST", body: payload, skipAuth: true }),
    }),

    /** Ends this device's session. Always 204, even if the session was already over. */
    logout: build.mutation<void, string>({
      query: (refreshToken) => ({ url: "/auth/logout", method: "POST", body: { refreshToken }, skipAuth: true }),
    }),

    /** Ends every session of this user on every device, including this one. */
    logoutAll: build.mutation<void, void>({
      query: () => ({ url: "/auth/logout-all", method: "POST" }),
    }),

    forgotPassword: build.mutation<IMessageResponse, string>({
      query: (email) => ({ url: "/auth/password/forgot", method: "POST", body: { email }, skipAuth: true }),
    }),

    resetPassword: build.mutation<IMessageResponse, IResetPasswordPayload>({
      query: (payload) => ({ url: "/auth/password/reset", method: "POST", body: payload, skipAuth: true }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useLoginMutation,
  useLogoutMutation,
  useLogoutAllMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
