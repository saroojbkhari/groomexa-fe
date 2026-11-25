"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routes } from "@/config/site";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import TextFormField from "@/components/TextFormField";
import useLogin from "@/hooks/auth/useLogin";
import { applyApiError } from "@/utils/formHelper";
import AuthCard from "@/components/AuthCard";
import ResendVerificationForm from "@/components/ResendVerificationForm";
import { loginSchema, type LoginValues } from "@/utils/validation";

/**
 * After a successful login, containers/GuestRoute (in the page) goes to `?next=` or the dashboard.
 * `passwordReset`: the user just set a new password (/login?reset=success).
 */
export default function Login({ passwordReset = false }: { passwordReset?: boolean }) {
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" }, mode: "onTouched" });
  const { isSubmitting, errors } = form.formState;
  /** The account exists but its email isn't verified yet: offer to resend the link. */
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const { login } = useLogin();

  const onSubmit = form.handleSubmit(async (values) => {
    setUnverifiedEmail(null);
    // On success the hook starts the session and GuestRoute navigates away.
    const res = await login(values);
    if (res.ok) return;
    // INVALID_CREDENTIALS covers wrong password, unknown email AND a locked account: we show the backend's one message.
    if (res.error.code === "EMAIL_NOT_VERIFIED") setUnverifiedEmail(values.email);
    applyApiError(form, res.error);
  });

  return (
    <AuthCard
      title="Welcome back"
      intro="Log in to see today's dogs, bookings and payments."
      footer={<>New to Groomexa? <Link href={routes.signup} className="font-semibold text-ink underline underline-offset-4">Start your free trial</Link></>}
    >
      {passwordReset && !errors.root && !unverifiedEmail && (
        <Alert variant="success" className="mb-7">
          <AlertDescription>Password changed. Log in with your new password.</AlertDescription>
        </Alert>
      )}
      {/* Outside the login <form>: forms can't be nested. */}
      {unverifiedEmail && (
        <div className="mb-7 flex flex-col gap-4">
          <Alert variant="destructive">
            <AlertDescription>{errors.root?.message ?? "Please verify your email before logging in."}</AlertDescription>
          </Alert>
          <ResendVerificationForm key={unverifiedEmail} email={unverifiedEmail} variant="dark" />
        </div>
      )}
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          {errors.root && !unverifiedEmail && (
            <Alert variant="destructive">
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}
          <TextFormField control={form.control} name="email" label="Email" type="email" autoComplete="email" inputMode="email" />
          <div className="flex flex-col gap-2">
            <TextFormField control={form.control} name="password" label="Password" revealable autoComplete="current-password" />
            <Link href={routes.forgotPassword} className="w-fit text-sm font-semibold text-teal underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in…" : "Log in"}
          </Button>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
