"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routes } from "@/config/site";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import TextFormField from "@/components/TextFormField";
import AuthCard from "@/components/AuthCard";
import { PASSWORD_HINT, resetSchema, type ResetValues } from "@/utils/validation";
import useResetPassword from "@/hooks/auth/useResetPassword";
import { removeQueryFromUrl } from "@/utils/common";
import { applyApiError } from "@/utils/formHelper";

/**
 * Landing page for the emailed link: `/reset-password?token=…` (valid 1 hour, single use).
 * On success the hook ends any local session and goes to /login?reset=success.
 */
export default function ResetPassword({ token }: { token?: string }) {
  const form = useForm<ResetValues>({ resolver: zodResolver(resetSchema), defaultValues: { password: "", confirm: "" }, mode: "onTouched" });
  const { isSubmitting, errors } = form.formState;
  const { reset } = useResetPassword();

  // Take the token out of the address bar right away; it stays in the `token` prop.
  useEffect(() => {
    if (token) removeQueryFromUrl();
  }, [token]);

  const onSubmit = form.handleSubmit(async ({ password }) => {
    const res = await reset(token ?? "", password);
    // TOKEN_INVALID → root alert (+ "Request a new link" below). PASSWORD_TOO_COMMON → password field;
    // the token isn't used up then, so the user can try another password.
    if (!res.ok) applyApiError(form, res.error, { PASSWORD_TOO_COMMON: "password" });
  });

  const requestNew = <Link href={routes.forgotPassword} className="font-semibold text-ink underline underline-offset-4">Request a new link</Link>;

  if (!token)
    return (
      <AuthCard title="Link not valid" footer={requestNew}>
        <Alert variant="destructive">
          <AlertDescription>This reset link is missing or has expired. Links work once and last 1 hour.</AlertDescription>
        </Alert>
      </AuthCard>
    );

  return (
    <AuthCard title="Choose a new password" footer={requestNew}>
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          {errors.root && (
            <Alert variant="destructive">
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}
          <TextFormField control={form.control} name="password" label="New password" revealable autoComplete="new-password" description={PASSWORD_HINT} />
          <TextFormField control={form.control} name="confirm" label="Confirm new password" revealable autoComplete="new-password" />
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save new password"}
          </Button>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
