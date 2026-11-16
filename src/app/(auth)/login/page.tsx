import type { Metadata } from "next";
import { Suspense } from "react";
import { routes } from "@/config/site";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Groomexa to manage your grooming salon's bookings, clients and payments.",
  alternates: { canonical: routes.login },
};

async function WithNext({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  return <LoginForm next={typeof next === "string" ? next : undefined} />;
}

/** The form is prerendered as the fallback; `?next=/calendar` streams in to return users where they were heading. */
export default function LoginPage(props: PageProps<"/login">) {
  return (
    <Suspense fallback={<LoginForm />}>
      <WithNext {...props} />
    </Suspense>
  );
}
