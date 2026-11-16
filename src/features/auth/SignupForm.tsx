"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routes } from "@/config/site";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { TextFormField } from "@/components/forms/text-form-field";
import { AuthCard } from "./AuthCard";
import { PASSWORD_HINT, signupSchema, type SignupValues } from "./schemas";
import { signUp } from "./service";

const PLANS: Record<string, string> = { solo: "Solo", studio: "Studio" };
const link = "font-semibold text-ink underline underline-offset-4";

export function SignupForm({ plan }: { plan?: string }) {
  const router = useRouter();
  const planName = plan ? PLANS[plan] : undefined;
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { salon: "", name: "", email: "", password: "", terms: false },
    mode: "onTouched",
  });
  const { isSubmitting, errors } = form.formState;

  const onSubmit = form.handleSubmit(async (values) => {
    const res = await signUp({ ...values, plan });
    if (!res.ok) return form.setError("root", { message: res.error });
    router.push(routes.app);
  });

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
          <TextFormField control={form.control} name="salon" label="Salon name" autoComplete="organization" />
          <TextFormField control={form.control} name="name" label="Your name" autoComplete="name" />
          <TextFormField control={form.control} name="email" label="Work email" type="email" autoComplete="email" inputMode="email" />
          <TextFormField control={form.control} name="password" label="Password" revealable autoComplete="new-password" description={PASSWORD_HINT} />
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
