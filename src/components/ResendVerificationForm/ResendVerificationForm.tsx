"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import TextFormField from "@/components/TextFormField";
import { EMAIL_COOLDOWN_SECONDS } from "@/constants/auth";
import useResendVerification from "@/hooks/auth/useResendVerification";
import useCooldown from "@/hooks/common/useCooldown";
import { applyApiError } from "@/utils/formHelper";
import { resendVerificationSchema, type ResendVerificationValues } from "@/utils/validation";

/**
 * Sends a fresh verification link. With `email` it's a single button (we already know the address);
 * without it, it asks for the email first. Used after sign-up, on an invalid verify link, and on login
 * when the email isn't verified yet.
 *
 * The API always answers the same way (it never reveals whether the account exists), so we always show
 * the same message. After each send the button waits 60 s.
 */
export default function ResendVerificationForm({ email, variant = "outline" }: { email?: string; variant?: "default" | "outline" | "dark" }) {
  const form = useForm<ResendVerificationValues>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: { email: email ?? "" },
    mode: "onTouched",
  });
  const { isSubmitting, isSubmitSuccessful, errors } = form.formState;
  const { resend } = useResendVerification();
  const cooldown = useCooldown(EMAIL_COOLDOWN_SECONDS);

  const onSubmit = form.handleSubmit(async (values) => {
    const res = await resend(values.email);
    if (res.ok) cooldown.start();
    else applyApiError(form, res.error);
  });

  const label = isSubmitting ? "Sending…" : cooldown.remaining > 0 ? `Resend again in ${cooldown.remaining}s` : "Resend verification email";

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup className="gap-4">
        {errors.root && (
          <Alert variant="destructive">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}
        {isSubmitSuccessful && !errors.root && (
          <Alert variant="success">
            <AlertDescription>If that account exists and isn&apos;t verified yet, we&apos;ve sent a new link. Check your inbox and spam folder.</AlertDescription>
          </Alert>
        )}
        {!email && <TextFormField control={form.control} name="email" label="Email" type="email" autoComplete="email" inputMode="email" />}
        <Button type="submit" variant={variant} size="lg" className="w-full" disabled={isSubmitting || cooldown.remaining > 0}>
          {label}
        </Button>
      </FieldGroup>
    </form>
  );
}
