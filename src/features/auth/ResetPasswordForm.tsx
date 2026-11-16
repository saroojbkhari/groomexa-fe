"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routes } from "@/config/site";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { TextFormField } from "@/components/forms/text-form-field";
import { AuthCard } from "./AuthCard";
import { PASSWORD_HINT, resetSchema, type ResetValues } from "./schemas";
import { resetPassword } from "./service";

/** Landing page for the emailed link: `/reset-password?token=…`. */
export function ResetPasswordForm({ token }: { token?: string }) {
  const form = useForm<ResetValues>({ resolver: zodResolver(resetSchema), defaultValues: { password: "", confirm: "" }, mode: "onTouched" });
  const { isSubmitting, isSubmitSuccessful, errors } = form.formState;

  const onSubmit = form.handleSubmit(async ({ password }) => {
    const res = await resetPassword(token ?? "", password);
    if (!res.ok) form.setError("root", { message: res.error });
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

  // `isSubmitSuccessful` is false when setError("root") was called during submit.
  if (isSubmitSuccessful && !errors.root)
    return (
      <AuthCard title="Password updated">
        <Alert variant="success">
          <AlertDescription>Your password has been changed. Use it next time you log in.</AlertDescription>
        </Alert>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link href={routes.login}>Log in</Link>
        </Button>
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
