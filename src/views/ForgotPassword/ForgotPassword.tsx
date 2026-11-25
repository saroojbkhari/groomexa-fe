"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routes } from "@/config/site";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import TextFormField from "@/components/TextFormField";
import { EMAIL_COOLDOWN_SECONDS } from "@/constants/auth";
import useCooldown from "@/hooks/common/useCooldown";
import AuthCard from "@/components/AuthCard";
import { forgotSchema, type ForgotValues } from "@/utils/validation";
import useForgotPassword from "@/hooks/auth/useForgotPassword";
import { applyApiError } from "@/utils/formHelper";

export default function ForgotPassword() {
  const form = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema), defaultValues: { email: "" }, mode: "onTouched" });
  const { isSubmitting, isSubmitSuccessful, errors } = form.formState;
  const { requestReset } = useForgotPassword();
  const cooldown = useCooldown(EMAIL_COOLDOWN_SECONDS);

  // The API always answers the same way, so we never say whether the account exists.
  const onSubmit = form.handleSubmit(async ({ email }) => {
    const res = await requestReset(email);
    if (res.ok) cooldown.start();
    else applyApiError(form, res.error);
  });

  const back = <Link href={routes.login} className="font-semibold text-ink underline underline-offset-4">Back to log in</Link>;

  // `isSubmitSuccessful` is false when setError("root") was called during submit.
  if (isSubmitSuccessful && !errors.root)
    return (
      <AuthCard title="Check your email" footer={back}>
        <Alert variant="success">
          <AlertDescription>
            If an account with <strong>{form.getValues("email")}</strong> exists, we&apos;ve sent a reset link. It expires in 1 hour.
          </AlertDescription>
        </Alert>
        <p className="mt-5 mb-4 text-sm text-muted-foreground">No email after a few minutes? Check your spam folder, or send it again.</p>
        <form onSubmit={onSubmit} noValidate>
          <Button type="submit" variant="outline" size="lg" className="w-full" disabled={isSubmitting || cooldown.remaining > 0}>
            {isSubmitting ? "Sending…" : cooldown.remaining > 0 ? `Send again in ${cooldown.remaining}s` : "Send again"}
          </Button>
        </form>
      </AuthCard>
    );

  return (
    <AuthCard title="Reset your password" intro="Enter the email you use for Groomexa and we'll send you a reset link." footer={back}>
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          {errors.root && (
            <Alert variant="destructive">
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}
          <TextFormField control={form.control} name="email" label="Email" type="email" autoComplete="email" inputMode="email" />
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send reset link"}
          </Button>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
