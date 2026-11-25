/** A failed API call, as plain serializable data (safe to keep in Redux). */
export interface IApiError {
  /** "ApiError", or "AuthError" when the session has ended and couldn't be refreshed. */
  name: string;
  /** HTTP status; 0 when there was no response (network error or timeout). */
  status: number;
  /** Machine-readable code from the backend (e.g. "EMAIL_TAKEN") or our own (e.g. "NETWORK_ERROR"). Branch on this, not on `message`. */
  code: string;
  /** Safe to show to the user. */
  message: string;
  /** Per-field messages keyed by request body field, e.g. { email: "Invalid email address" }. */
  fieldErrors?: Record<string, string>;
}

/** What the hooks return to components after an API call. */
export type TRequestResult = { ok: true } | { ok: false; error: IApiError };

export enum ERequestStatus {
  Idle = "idle",
  Pending = "pending",
  Succeeded = "succeeded",
  Failed = "failed",
}
