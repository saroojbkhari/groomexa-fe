"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/site";
import { LogoMark } from "@/components/Logo";
import useSession from "@/hooks/auth/useSession";
import { ESessionStatus } from "@/typings/auth";

/**
 * Second guard for signed-in pages (proxy.ts is the first, on the server). The tokens live in the browser,
 * so only here can we confirm the session is still valid: after the startup refresh.
 * - unknown → a neutral full-page loader, no app UI (the startup refresh is still running)
 * - anonymous → /login (with ?next= on a first visit; plain /login after logging out)
 * The backend still verifies the token on every API call; this only decides what to render.
 */
export default function AuthRoute({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (status === ESessionStatus.Authenticated) wasAuthenticated.current = true;
    if (status !== ESessionStatus.Anonymous) return;
    const next = `${window.location.pathname}${window.location.search}`;
    router.replace(wasAuthenticated.current ? routes.login : `${routes.login}?next=${encodeURIComponent(next)}`);
  }, [status, router]);

  if (status !== ESessionStatus.Authenticated)
    return (
      <div role="status" aria-label="Loading" className="flex min-h-dvh items-center justify-center bg-cream">
        <span className="animate-pulse">
          <LogoMark size={40} />
        </span>
      </div>
    );

  return children;
}
