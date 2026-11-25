/**
 * localStorage key for the refresh token (shared by every tab). The access token is never stored:
 * it lives in memory only (utils/storage.ts).
 */
export const REFRESH_TOKEN = "groomexa.refreshToken";

/** Web Lock name: only one tab at a time may use the refresh token (utils/fetch.ts). */
export const REFRESH_LOCK = "groomexa-refresh";

/**
 * Cookie that only says "this browser has a session" (value "1", never a token). proxy.ts reads it on the
 * server so signed-out visitors are redirected to /login before any app page renders.
 */
export const SESSION_COOKIE = "gx_session";
/** Same lifetime as the refresh token. */
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/** Attribute on <html> while there's a session; the classes below use it to swap "Log in" for "Go to dashboard". */
export const SESSION_ATTRIBUTE = "data-session";

/**
 * Tailwind classes for UI that differs on static pages (both versions are in the HTML; CSS shows one):
 * GUEST_ONLY hides an element when <html data-session> is set, MEMBER_ONLY hides it when it isn't.
 */
export const GUEST_ONLY = "[html[data-session]_&]:hidden!";
export const MEMBER_ONLY = "[html:not([data-session])_&]:hidden!";

/**
 * Runs in <head> before the first paint: marks <html> if the session cookie is set, so logged-in users
 * never see a flash of "Log in" on static pages. Static code, no user data.
 */
export const SESSION_ATTRIBUTE_SCRIPT = `document.cookie.split("; ").indexOf("${SESSION_COOKIE}=1")>-1&&document.documentElement.setAttribute("${SESSION_ATTRIBUTE}","")`;
