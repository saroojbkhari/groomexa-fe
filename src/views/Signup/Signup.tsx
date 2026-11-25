"use client";

import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routes } from "@/config/site";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import TextFormField from "@/components/TextFormField";
import useRegister from "@/hooks/auth/useRegister";
import { applyApiError } from "@/utils/formHelper";
import AuthCard from "@/components/AuthCard";
import ResendVerificationForm from "@/components/ResendVerificationForm";
import { PASSWORD_HINT, signupSchema, type SignupValues } from "@/utils/validation";

const PLANS: Record<string, string> = { solo: "Solo", studio: "Studio" };
const link = "font-semibold text-ink underline underline-offset-4";

export default function Signup({ plan }: { plan?: string }) {
  const planName = plan ? PLANS[plan] : undefined;
  /** `registeredEmail` is set (in Redux) once the account is created: the user must verify their email before logging in. */
  const { registeredEmail, register } = useRegister();
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { salonName: "", ownerName: "", email: "", phone: "", password: "", terms: false },
    mode: "onTouched",
  });
  const { isSubmitting, errors } = form.formState;
  /** 409 EMAIL_TAKEN: offer log in / reset password instead. */
  const [emailTaken, setEmailTaken] = useState(false);

  const onSubmit = form.handleSubmit(async (values) => {
    setEmailTaken(false);
    // `terms` is a UI-only checkbox; the API doesn't take it.
    const { salonName, ownerName, email, phone, password } = values;
    const res = await register({ salonName, ownerName, email, phone, password });
    if (res.ok) return;
    setEmailTaken(res.error.code === "EMAIL_TAKEN");
    applyApiError(form, res.error, { EMAIL_TAKEN: "email", PASSWORD_TOO_COMMON: "password" });
  });

  if (registeredEmail)
    return (
      <AuthCard title="Check your email" footer={<>Already verified? <Link href={routes.login} className={link}>Log in</Link></>}>
        <Alert variant="success">
          <AlertDescription>
            We&apos;ve sent a verification link to <strong>{registeredEmail}</strong>. Open it to activate your salon, then log in.
          </AlertDescription>
        </Alert>
        <p className="mt-5 mb-4 text-sm text-muted-foreground">No email after a few minutes? Check your spam folder, or send it again.</p>
        <ResendVerificationForm email={registeredEmail} />
      </AuthCard>
    );

  return (
    <AuthCard
      title="Start your free trial"
      intro={
        <>
          Set up your salon in minutes. No card needed.
          {planName && <Badge className="ml-2 h-6 bg-accent px-2.5 align-middle font-semibold text-ink">{planName} plan</Badge>}
        </>
      }
      footer={<>Already have an account? <Link href={routes.login} className={link}>Log in</Link></>}
    >
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          {errors.root && (
            <Alert variant="destructive">
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}
          <TextFormField control={form.control} name="salonName" label="Salon name" autoComplete="organization" maxLength={120} />
          <TextFormField control={form.control} name="ownerName" label="Your name" autoComplete="name" maxLength={100} />
          <TextFormField control={form.control} name="email" label="Work email" type="email" autoComplete="email" inputMode="email" />
          {emailTaken && (
            <p className="-mt-3 text-sm text-muted-foreground">
              Is it yours? <Link href={routes.login} className={link}>Log in</Link> or{" "}
              <Link href={routes.forgotPassword} className={link}>reset your password</Link>.
            </p>
          )}
          <TextFormField
            control={form.control}
            name="phone"
            label="Phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+923001234567"
            description="International format, starting with + and your country code."
          />
          <TextFormField control={form.control} name="password" label="Password" revealable autoComplete="new-password" maxLength={72} description={PASSWORD_HINT} />
          <Controller
            control={form.control}
            name="terms"
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid} className="flex-wrap items-start">
                <Checkbox
                  id="terms"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  onBlur={field.onBlur}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.invalid ? "terms-error" : undefined}
                  className="mt-0.5 size-5"
                />
                <FieldLabel htmlFor="terms" className="block flex-1 text-sm font-normal text-muted-foreground">
                  I agree to the <Link href={routes.terms} className={link}>Terms</Link> and <Link href={routes.privacy} className={link}>Privacy Policy</Link>.
                </FieldLabel>
                <FieldError id="terms-error" errors={[fieldState.error]} className="basis-full" />
              </Field>
            )}
          />
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating your salon…" : "Create my salon"}
          </Button>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
