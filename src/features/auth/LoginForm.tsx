"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routes } from "@/config/site";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { TextFormField } from "@/components/forms/text-form-field";
import { AuthCard } from "./AuthCard";
import { loginSchema, type LoginValues } from "./schemas";
import { signIn } from "./service";

/** Only follow same-site relative paths (prevents open redirects). */
const safeNext = (next?: string) => (next?.startsWith("/") && !next.startsWith("//") ? next : routes.app);

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" }, mode: "onTouched" });
  const { isSubmitting, errors } = form.formState;

  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    const res = await signIn(email, password);
    if (!res.ok) return form.setError("root", { message: res.error });
    router.push(safeNext(next));
  });

  return (
    <AuthCard
      title="Welcome back"
      intro="Log in to see today's dogs, bookings and payments."
      footer={<>New to Groomexa? <Link href={routes.signup} className="font-semibold text-ink underline underline-offset-4">Start your free trial</Link></>}
    >
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          {errors.root && (
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
