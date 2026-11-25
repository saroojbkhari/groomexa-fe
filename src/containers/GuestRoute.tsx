"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import useSession from "@/hooks/auth/useSession";
import { ESessionStatus } from "@/typings/auth";
import { safeNext } from "@/utils/common";

/**
 * For log in, sign up and forgot password: once there's a session (already logged in, or just logged in
 * on this page), go to `?next=` (same-site paths only) or the dashboard.
 * Not used on /verify-email and /reset-password: those must always work from an email link.
 */
export default function GuestRoute({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== ESessionStatus.Authenticated) return;
    router.replace(safeNext(new URLSearchParams(window.location.search).get("next")));
  }, [status, router]);

  return children;
}
