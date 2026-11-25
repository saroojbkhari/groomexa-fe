"use client";

import Link from "next/link";
import { routes } from "@/config/site";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import AuthCard from "@/components/AuthCard";
import ResendVerificationForm from "@/components/ResendVerificationForm";
import useVerifyEmail from "@/hooks/auth/useVerifyEmail";
import { ERequestStatus } from "@/typings/common";

/** Landing page for the emailed link: `/verify-email?token=…`. The hook does the API call. */
export default function VerifyEmail({ token }: { token?: string }) {
  const { status, error } = useVerifyEmail(token);

  if (status === ERequestStatus.Idle || status === ERequestStatus.Pending)
    return (
      <AuthCard title="Verifying your email…">
        <p role="status" aria-live="polite" className="text-muted-foreground">
          Hang tight, this only takes a moment.
        </p>
      </AuthCard>
    );

  if (status === ERequestStatus.Succeeded)
    return (
      <AuthCard title="Email verified">
        <Alert variant="success">
          <AlertDescription>Your salon is ready. Log in to get started.</AlertDescription>
        </Alert>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link href={routes.login}>Log in</Link>
        </Button>
      </AuthCard>
    );

  return (
    <AuthCard
      title="Link not valid"
      footer={
        <>
          Already verified?{" "}
          <Link href={routes.login} className="font-semibold text-ink underline underline-offset-4">
            Log in
          </Link>
        </>
      }
    >
      <Alert variant="destructive">
        <AlertDescription>{error ?? "This link is invalid, already used, or expired. Request a new one."}</AlertDescription>
      </Alert>
      <p className="mt-5 mb-4 text-sm text-muted-foreground">Enter your email and we&apos;ll send you a fresh verification link.</p>
      <ResendVerificationForm variant="default" />
    </AuthCard>
  );
}
