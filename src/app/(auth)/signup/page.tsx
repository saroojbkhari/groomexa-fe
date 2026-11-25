import type { Metadata } from "next";
import { Suspense } from "react";
import { routes } from "@/config/site";
import GuestRoute from "@/containers/GuestRoute";
import Signup from "@/views/Signup";

export const metadata: Metadata = {
  title: "Start your free trial",
  description: "Create your Groomexa account and set up online booking, reminders and deposits for your grooming salon in minutes.",
  alternates: { canonical: routes.signup },
};

async function WithPlan({ searchParams }: PageProps<"/signup">) {
  const { plan } = await searchParams;
  return <Signup plan={typeof plan === "string" ? plan : undefined} />;
}

/** The form is prerendered as the fallback; `?plan=solo|studio` (from the pricing cards) streams in. */
export default function SignupPage(props: PageProps<"/signup">) {
  return (
    <GuestRoute>
      <Suspense fallback={<Signup />}>
        <WithPlan {...props} />
      </Suspense>
    </GuestRoute>
  );
}
