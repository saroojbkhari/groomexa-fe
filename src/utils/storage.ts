import { REFRESH_TOKEN, SESSION_ATTRIBUTE, SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/constants/storage";
import type { IAuthTokensResponse, IAuthUser } from "@/typings/auth";

/**
 * The session, outside React (the axios interceptors need it too):
 * - access token: in memory only (this variable). Gone on reload; the startup refresh gets a new one.
 * - refresh token: localStorage, so every tab shares it and it survives a reload.
 * - user: sent to subscribers (containers/SessionProvider puts it in Redux).
 * - a "has a session" cookie (no token in it) so proxy.ts can keep signed-out visitors out of app pages.
 *
 * localStorage is readable by any script on the page, so an XSS bug = account takeover.
 * Never render user data with dangerouslySetInnerHTML / innerHTML, never log tokens, never put them in URLs.
 */
let accessToken: string | null = null;

type TSessionListener = (user: IAuthUser | null) => void;
const listeners = new Set<TSessionListener>();
const notify = (user: IAuthUser | null) => listeners.forEach((listener) => listener(user));

/** localStorage can throw (private mode, blocked storage) and doesn't exist during server rendering. */
function readRefreshToken(): string | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage.getItem(REFRESH_TOKEN);
  } catch {
    return null;
  }
}

/**
 * The flag cookie for proxy.ts. Not httpOnly (we set it here), but it holds nothing secret.
 * Also toggles <html data-session>, which shows/hides logged-in-only UI with CSS (see app/layout.tsx).
 */
function setSessionCookie(on: boolean) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SESSION_COOKIE}=${on ? "1" : ""}; Path=/; Max-Age=${on ? SESSION_COOKIE_MAX_AGE : 0}; SameSite=Lax${secure}`;
  document.documentElement.toggleAttribute(SESSION_ATTRIBUTE, on);
}

function getAccessToken(): string | null {
  return accessToken;
}

function getRefreshToken(): string | null {
  return readRefreshToken();
}

/** After login or refresh. Replaces the refresh token immediately: the old one is now used up. */
function setSession({ accessToken: access, refreshToken, user }: IAuthTokensResponse) {
  accessToken = access;
  try {
    window.localStorage.setItem(REFRESH_TOKEN, refreshToken);
  } catch {
    // Storage blocked: the session still works in this tab until it's closed.
  }
  setSessionCookie(true);
  notify(user);
}

/** Logout, expired session, or another tab logged out. */
function clearSession() {
  accessToken = null;
  try {
    window.localStorage.removeItem(REFRESH_TOKEN);
  } catch {
    // nothing stored
  }
  setSessionCookie(false);
  notify(null);
}

/** Called with the user on every setSession, and with null on clearSession. Returns an unsubscribe function. */
function subscribe(listener: TSessionListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const storage = {
  getAccessToken,
  getRefreshToken,
  setSession,
  clearSession,
  subscribe,
};

export default storage;
