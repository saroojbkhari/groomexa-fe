"use client";

import { useEffect, type ReactNode } from "react";
import { REFRESH_TOKEN } from "@/constants/storage";
import useDispatch from "@/hooks/common/useDispatch";
import { setUser } from "@/state/auth/slice";
import { refreshSession } from "@/utils/fetch";
import storage from "@/utils/storage";

/**
 * Keeps Redux's auth state in sync with the session in utils/storage:
 * 1. On app start: the access token is only in memory, so it's gone after a reload. If there's a refresh token,
 *    refresh once to get a new access token and the current user. (There's no /me endpoint: this IS how we load the user.)
 * 2. Every setSession / clearSession (login, refresh, logout, expired) updates the store.
 * 3. Another tab removed the refresh token (it logged out) → log out here too.
 */
export default function SessionProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = storage.subscribe((user) => dispatch(setUser(user)));

    if (storage.getRefreshToken()) {
      // Strict Mode runs this twice in development; refreshSession() is single-flight, so it's still one request.
      refreshSession().then((ok) => {
        if (!ok) dispatch(setUser(null));
      });
    } else {
      // No session. Also removes a leftover session cookie (e.g. localStorage was cleared by hand),
      // so proxy.ts stops letting this browser into app pages.
      storage.clearSession();
    }

    const onStorage = (event: StorageEvent) => {
      // key === null means localStorage.clear(). A *changed* token is fine: the next refresh reads the new value.
      if ((event.key === REFRESH_TOKEN || event.key === null) && !storage.getRefreshToken()) storage.clearSession();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, [dispatch]);

  return children;
}
