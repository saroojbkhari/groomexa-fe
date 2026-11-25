import { useEffect, useRef } from "react";
import { useVerifyEmailMutation } from "@/state/auth/authQuery";
import { ERequestStatus } from "@/typings/common";
import { removeQueryFromUrl } from "@/utils/common";

/**
 * Verifies the emailed token once the page has loaded (in the browser, never during server rendering:
 * link previewers and prefetches would otherwise use up the single-use token).
 */
export default function useVerifyEmail(token?: string) {
  const [verifyEmailMutation, { isUninitialized, isLoading, isSuccess, error }] = useVerifyEmailMutation();
  // React Strict Mode runs effects twice in development; a second call would fail as "already used".
  const sent = useRef(false);

  useEffect(() => {
    if (!token || sent.current) return;
    sent.current = true;
    removeQueryFromUrl(); // the token stays in the `token` prop only
    verifyEmailMutation(token);
  }, [verifyEmailMutation, token]);

  if (!token) return { status: ERequestStatus.Failed, error: "This verification link is missing or incomplete. Request a new one below." };
  if (isUninitialized || isLoading) return { status: ERequestStatus.Pending };
  if (isSuccess) return { status: ERequestStatus.Succeeded };
  return { status: ERequestStatus.Failed, error: error?.message };
}
