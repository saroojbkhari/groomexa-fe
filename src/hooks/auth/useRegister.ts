import { useCallback } from "react";
import { useRegisterMutation } from "@/state/auth/authQuery";
import type { IRegisterPayload } from "@/typings/auth";
import { toRequestResult } from "@/utils/request";

/** Sign up. After success, `registeredEmail` is set so the page can show "Check your email". */
export default function useRegister() {
  const [registerMutation, { isSuccess, originalArgs }] = useRegisterMutation();

  const register = useCallback((payload: IRegisterPayload) => toRequestResult(registerMutation(payload)), [registerMutation]);

  return { registeredEmail: isSuccess ? originalArgs?.email : undefined, register };
}
