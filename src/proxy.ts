import { NextResponse, type NextRequest } from "next/server";
import { routes } from "@/config/site";
import { SESSION_COOKIE } from "@/constants/storage";

/**
 * Route guard (Next 16 "Proxy", formerly middleware). Runs on the server BEFORE an app page renders:
 * no session cookie → straight to /login?next=<where they were heading>, so signed-out visitors never see the app.
 *
 * The cookie only says "this browser has a session"; the tokens themselves are in the browser
 * (utils/storage.ts). If the session turns out to be dead, the startup refresh fails and
 * containers/AuthRoute sends the user to /login (and the cookie is removed).
 */
export function proxy(request: NextRequest) {
  if (request.cookies.get(SESSION_COOKIE)?.value === "1") return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const login = new URL(routes.login, request.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

/** Every signed-in area. Add new app sections here (and they're guarded client-side by app/(app)/layout too). */
export const config = {
  matcher: ["/dashboard/:path*", "/clients/:path*", "/pets/:path*", "/visits/:path*", "/calendar/:path*"],
};
