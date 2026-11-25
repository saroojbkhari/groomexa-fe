import { routes } from "@/config/site";

export { cn } from "cn";

/** Only follow same-site relative paths (prevents open redirects like `?next=https://evil.com` or `//evil.com`). */
export function safeNext(next: unknown, fallback: string = routes.app): string {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}

/**
 * Removes `?token=…` (and any other query) from the address bar without reloading, so a one-time token
 * doesn't stay in the browser history. Next.js keeps its router in sync with history.replaceState.
 */
export function removeQueryFromUrl() {
  window.history.replaceState(window.history.state, "", window.location.pathname);
}
