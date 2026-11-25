import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/site";
import useDispatch from "@/hooks/common/useDispatch";
import { useResetPasswordMutation } from "@/state/auth/authQuery";
import { baseApi } from "@/state/baseQuery";
import { toRequestResult } from "@/utils/request";
import storage from "@/utils/storage";

/**
 * Sets a new password using the token from the emailed link. On success the backend has logged out
 * every device, so we end the local session too and go to the login page with a success notice.
 */
export default function useResetPassword() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [resetPasswordMutation] = useResetPasswordMutation();

  const reset = useCallback(
    async (token: string, password: string) => {
      const result = await toRequestResult(resetPasswordMutation({ token, password }));
      if (result.ok) {
        storage.clearSession();
        dispatch(baseApi.util.resetApiState());
        router.replace(`${routes.login}?reset=success`);
      }
      return result;
    },
    [resetPasswordMutation, dispatch, router],
  );

  return { reset };
}
