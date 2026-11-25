import { useCallback } from "react";
import { useLoginMutation } from "@/state/auth/authQuery";
import type { ILoginPayload } from "@/typings/auth";
import { toRequestResult } from "@/utils/request";
import storage from "@/utils/storage";

/**
 * Logs in and starts the session. No navigation here: containers/GuestRoute sees the new session and
 * moves on to `?next=` or the dashboard.
 */
export default function useLogin() {
  const [loginMutation] = useLoginMutation();

  const login = useCallback(
    async (payload: ILoginPayload) => {
      const response = await loginMutation(payload);
      if (response.data) storage.setSession(response.data);
      return toRequestResult(response);
    },
    [loginMutation],
  );

  return { login };
}
