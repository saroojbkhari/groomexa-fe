import { isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import type { IApiError } from "@/typings/common";
import storage from "@/utils/storage";

/** The backend's error body: `{ error: { code, message, details? } }`. */
interface IBackendErrorBody {
  error?: { code?: string; message?: string; details?: unknown };
}

const GENERIC_MESSAGE = "Something went wrong on our side. Please try again.";

/** Every failed request is turned into an ApiError by the response interceptor in utils/fetch.ts. */
export class ApiError extends Error {
  status: number;
  code: string;
  fieldErrors?: Record<string, string>;

  constructor(status: number, code: string, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }

  /** Normalizes anything axios rejects with (HTTP error, timeout, network failure) into an ApiError. */
  static from(err: unknown): ApiError {
    if (err instanceof ApiError) return err;
    if (!isAxiosError<IBackendErrorBody>(err)) return new ApiError(0, "UNKNOWN_ERROR", GENERIC_MESSAGE);

    // No response at all: the request timed out or the backend is unreachable.
    if (!err.response) {
      if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT")
        return new ApiError(0, "TIMEOUT", "The server took too long to respond. Please try again.");
      return new ApiError(0, "NETWORK_ERROR", "We couldn't reach the server. Please try again in a moment.");
    }

    const { status, data } = err.response;
    const code = data?.error?.code ?? `HTTP_${status}`;

    // 5xx messages are never shown: they may describe internals and aren't actionable for the user.
    if (status === 501) return new ApiError(status, code, "This feature isn't available yet. Please try again later.");
    if (status >= 500) return new ApiError(status, code, GENERIC_MESSAGE);

    // The backend guarantees 4xx messages are safe to show (including RATE_LIMITED's "Too many attempts…").
    return new ApiError(status, code, data?.error?.message ?? GENERIC_MESSAGE, toFieldErrors(data?.error?.details));
  }

  /** Redux state and actions must be plain objects, not class instances. */
  toJSON(): IApiError {
    return { name: this.name, status: this.status, code: this.code, message: this.message, fieldErrors: this.fieldErrors };
  }
}

/** The session is over and couldn't be refreshed: the user has to log in again. */
export class AuthError extends ApiError {
  constructor() {
    super(401, "SESSION_EXPIRED", "Your session has expired. Please log in again.");
    this.name = "AuthError";
  }
}

/** Backend VALIDATION_FAILED details `[{ path: "email", message: "..." }]` → `{ email: "..." }` (first message per field). */
function toFieldErrors(details: unknown): Record<string, string> | undefined {
  if (!Array.isArray(details)) return undefined;
  const out: Record<string, string> = {};
  for (const d of details) {
    if (d && typeof d.path === "string" && typeof d.message === "string" && d.path && !out[d.path]) out[d.path] = d.message;
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * Redux middleware: when any API call fails with an AuthError, end the session.
 * One place for this rule instead of every component handling it. containers/AuthRoute sees the
 * session end and sends the user to the login page.
 */
const errorHandler: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action) && (action.payload as IApiError | undefined)?.name === "AuthError") {
    storage.clearSession();
  }
  return next(action);
};

export default errorHandler;
