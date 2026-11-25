import { useCallback } from "react";
import useDispatch from "@/hooks/common/useDispatch";
import { useLogoutAllMutation, useLogoutMutation } from "@/state/auth/authQuery";
import { baseApi } from "@/state/baseQuery";
import storage from "@/utils/storage";

/**
 * Log out of this device, or of every device. Local logout always happens, even if the request fails.
 * No navigation here: containers/AuthRoute sees the session end and goes to the login page.
 */
export default function useLogout() {
  const dispatch = useDispatch();
  const [logoutMutation] = useLogoutMutation();
  const [logoutAllMutation] = useLogoutAllMutation();

  const endLocalSession = useCallback(() => {
    storage.clearSession(); // other tabs get a `storage` event and log out too
    dispatch(baseApi.util.resetApiState()); // drop every cached response from this user
  }, [dispatch]);

  const logout = useCallback(async () => {
    const refreshToken = storage.getRefreshToken();
    if (refreshToken) await logoutMutation(refreshToken); // resolves (never throws), even if the call fails
    endLocalSession();
  }, [logoutMutation, endLocalSession]);

  const logoutAll = useCallback(async () => {
    await logoutAllMutation(); // an expired access token is refreshed and the call retried by the interceptor
    endLocalSession();
  }, [logoutAllMutation, endLocalSession]);

  return { logout, logoutAll };
}
