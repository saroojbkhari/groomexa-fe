import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyEmail from "@/views/VerifyEmail";

// noindex + no referrer so the one-time token in the URL never leaks to search engines or third parties.
export const metadata: Metadata = { title: "Verify your email", robots: { index: false, follow: false }, referrer: "no-referrer" };

async function WithToken({ searchParams }: PageProps<"/verify-email">) {
  const { token } = await searchParams;
  return <VerifyEmail token={typeof token === "string" ? token : undefined} />;
}

export default function VerifyEmailPage(props: PageProps<"/verify-email">) {
  return (
    <Suspense fallback={<div aria-busy="true" className="h-72 w-full max-w-[440px] rounded-[28px] bg-white" />}>
      <WithToken {...props} />
    </Suspense>
  );
}
