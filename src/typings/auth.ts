/** Request/response shapes of the backend's /auth endpoints (see groomexa-be/src/modules/auth/auth.schemas.ts). */

export interface IMessageResponse {
  message: string;
}

export interface IRegisterPayload {
  salonName: string;
  ownerName: string;
  email: string;
  /** E.164, e.g. +923001234567 */
  phone: string;
  password: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IResetPasswordPayload {
  token: string;
  password: string;
}

export type TRole = "superadmin" | "manager" | "groomer";

export interface IAuthUser {
  id: string;
  salonId: string;
  name: string;
  email: string;
  phone: string | null;
  role: TRole;
}

export interface IAuthTokens {
  /** JWT, sent as `Authorization: Bearer <token>`. Valid 15 minutes. Kept in memory only. */
  accessToken: string;
  /** Seconds until the access token expires (900). */
  accessTokenExpiresIn: number;
  /** Opaque, single use: /auth/refresh returns a NEW one each time. Valid 30 days. Kept in localStorage. */
  refreshToken: string;
}

/** Returned by /auth/login and /auth/refresh. `user` is always the current user (the role may have changed). */
export interface IAuthTokensResponse extends IAuthTokens {
  user: IAuthUser;
}

export enum ESessionStatus {
  /** The startup refresh hasn't finished yet. */
  Unknown = "unknown",
  Authenticated = "authenticated",
  Anonymous = "anonymous",
}
