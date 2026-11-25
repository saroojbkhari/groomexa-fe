import { ApiError } from "@/middlewares/errorHandler";
import type { IApiError, TRequestResult } from "@/typings/common";

function isApiError(error: unknown): error is IApiError {
  return typeof error === "object" && error !== null && "code" in error && "message" in error && "status" in error;
}

type TMutationResult = { data?: unknown; error?: unknown };

/**
 * Turns an RTK Query mutation call into `{ ok: true }` or `{ ok: false, error }` for components.
 * `error` is the IApiError from state/baseQuery.ts; anything else (a bug thrown in our own code) becomes a generic one.
 */
export async function toRequestResult(request: TMutationResult | PromiseLike<TMutationResult>): Promise<TRequestResult> {
  const result = await request;
  if (!("error" in result) || result.error === undefined) return { ok: true };
  return { ok: false, error: isApiError(result.error) ? result.error : ApiError.from(result.error).toJSON() };
}
