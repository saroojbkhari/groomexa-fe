import type { Metadata } from "next";
import { Suspense } from "react";
import { routes } from "@/config/site";
import { SignupForm } from "@/features/auth/SignupForm";

export const metadata: Metadata = {
  title: "Start your free trial",
  description: "Create your Groomexa account and set up online booking, reminders and deposits for your grooming salon in minutes.",
  alternates: { canonical: routes.signup },
};

async function WithPlan({ searchParams }: PageProps<"/signup">) {
  const { plan } = await searchParams;
  return <SignupForm plan={typeof plan === "string" ? plan : undefined} />;
}

/** The form is prerendered as the fallback; `?plan=solo|studio` (from the pricing cards) streams in. */
export default function SignupPage(props: PageProps<"/signup">) {
  return (
    <Suspense fallback={<SignupForm />}>
      <WithPlan {...props} />
    </Suspense>
  );
}
