import type { Metadata } from "next";
import { Suspense } from "react";
import { routes } from "@/config/site";
import GuestRoute from "@/containers/GuestRoute";
import Login from "@/views/Login";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Groomexa to manage your grooming salon's bookings, clients and payments.",
  alternates: { canonical: routes.login },
};

async function WithNotice({ searchParams }: PageProps<"/login">) {
  const { reset } = await searchParams;
  return <Login passwordReset={reset === "success"} />;
}

/**
 * The form is prerendered as the fallback; `?reset=success` (after a password reset) streams in.
 * GuestRoute moves logged-in users on to `?next=` or the dashboard.
 */
export default function LoginPage(props: PageProps<"/login">) {
  return (
    <GuestRoute>
      <Suspense fallback={<Login />}>
        <WithNotice {...props} />
      </Suspense>
    </GuestRoute>
  );
}
