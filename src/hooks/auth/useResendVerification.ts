import { useCallback } from "react";
import { useResendVerificationMutation } from "@/state/auth/authQuery";
import { toRequestResult } from "@/utils/request";

/** Sends a new verification email. The API answers the same way whether or not the account exists. */
export default function useResendVerification() {
  const [resendMutation] = useResendVerificationMutation();
  const resend = useCallback((email: string) => toRequestResult(resendMutation(email)), [resendMutation]);
  return { resend };
}
