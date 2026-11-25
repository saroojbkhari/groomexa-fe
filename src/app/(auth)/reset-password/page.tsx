import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPassword from "@/views/ResetPassword";

// noindex + no referrer so the one-time token in the URL never leaks to search engines or third parties.
export const metadata: Metadata = { title: "Choose a new password", robots: { index: false, follow: false }, referrer: "no-referrer" };

async function WithToken({ searchParams }: PageProps<"/reset-password">) {
  const { token } = await searchParams;
  return <ResetPassword token={typeof token === "string" ? token : undefined} />;
}

export default function ResetPasswordPage(props: PageProps<"/reset-password">) {
  return (
    <Suspense fallback={<div aria-busy="true" className="h-96 w-full max-w-[440px] rounded-[28px] bg-white" />}>
      <WithToken {...props} />
    </Suspense>
  );
}
