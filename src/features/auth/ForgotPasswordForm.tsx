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
import { forgotSchema, type ForgotValues } from "./schemas";
import { requestPasswordReset } from "./service";

export function ForgotPasswordForm() {
  const form = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema), defaultValues: { email: "" }, mode: "onTouched" });
  const { isSubmitting, isSubmitSuccessful } = form.formState;

  const onSubmit = form.handleSubmit(async ({ email }) => {
    await requestPasswordReset(email);
  });

  const back = <Link href={routes.login} className="font-semibold text-ink underline underline-offset-4">Back to log in</Link>;

  if (isSubmitSuccessful)
    return (
      <AuthCard title="Check your email" footer={back}>
        <Alert variant="success">
          <AlertDescription>
            If an account exists for <strong>{form.getValues("email")}</strong>, we&apos;ve sent a link to reset your password. It expires in 1 hour.
          </AlertDescription>
        </Alert>
        <p className="mt-5 text-sm text-muted-foreground">No email after a few minutes? Check your spam folder, or try again.</p>
        {/* Demo only: stands in for the link in the email. */}
        <Button asChild variant="dark" size="lg" className="mt-5 w-full">
          <Link href={`${routes.resetPassword}?token=demo`}>Open the reset link (demo)</Link>
        </Button>
      </AuthCard>
    );

  return (
    <AuthCard title="Reset your password" intro="Enter the email you use for Groomexa and we'll send you a reset link." footer={back}>
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <TextFormField control={form.control} name="email" label="Email" type="email" autoComplete="email" inputMode="email" />
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send reset link"}
          </Button>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
