import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import AuthRoute from "@/containers/AuthRoute";
import { appFontClass } from "@/themes/fonts";

/** Signed-in app shell: never indexed. */
export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Groomexa" },
  robots: { index: false, follow: false },
};

/**
 * Two guards: proxy.ts redirects signed-out visitors on the server before this renders, and AuthRoute
 * (wrapping the whole shell, sidebar included) waits for the startup refresh, so nothing from the app shows
 * until the session is confirmed.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthRoute>
      <div className={`${appFontClass} min-h-dvh bg-[#f9f6f0] text-ink lg:flex`}>
        <Sidebar />
        <main id="main" className="mx-auto w-full max-w-[1240px] min-w-0 flex-1 px-4 pt-7 pb-20 sm:px-6 lg:px-10 lg:pt-9">
          {children}
        </main>
      </div>
    </AuthRoute>
  );
}
