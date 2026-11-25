import { useCallback } from "react";
import { useForgotPasswordMutation } from "@/state/auth/authQuery";
import { toRequestResult } from "@/utils/request";

/** Requests a password reset email. The API answers the same way whether or not the email exists. */
export default function useForgotPassword() {
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const requestReset = useCallback((email: string) => toRequestResult(forgotPasswordMutation(email)), [forgotPasswordMutation]);
  return { requestReset };
}
