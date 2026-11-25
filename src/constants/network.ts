/**
 * Backend base URL. NEXT_PUBLIC_* is inlined into the browser bundle at build time (it isn't a secret).
 * The browser calls the API directly; the backend's CORS allows this app's origin.
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");
/** Request timeout in ms. */
export const DEFAULT_TIMEOUT = 1000 * 15;
