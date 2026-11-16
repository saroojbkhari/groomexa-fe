"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";
import { LogoMark } from "@/components/shared/logo";
import type { IconName } from "@/components/shared/icon";

/** App sections. Add an entry here as each screen is built. */
const NAV: { href: string; label: string; icon: IconName }[] = [{ href: routes.app, label: "Dashboard", icon: "home" }];

/** App navigation: left rail on desktop, top bar on mobile. */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex items-center justify-between gap-4 bg-ink px-4 py-3 text-cream lg:sticky lg:top-0 lg:h-dvh lg:w-[256px] lg:shrink-0 lg:flex-col lg:items-stretch lg:justify-start lg:gap-6 lg:px-3 lg:py-5">
      <Link href={routes.app} className="flex items-center gap-2.5 lg:px-2">
        <LogoMark inverted size={28} />
        <span className="font-display text-lg font-semibold text-white">Groomexa</span>
      </Link>

      <nav aria-label="App" className="lg:flex-1">
        <ul className="flex gap-1 lg:flex-col lg:gap-0.5">
          {NAV.map((item) => {
            const current = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors",
                    current ? "bg-white/12 text-white" : "text-mint/85 hover:bg-white/6 hover:text-white",
                  )}
                >
                  <Icon name={item.icon} size={20} className={current ? "text-coral" : "text-mist"} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Link
        href={routes.login}
        className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium text-mint/85 hover:bg-white/6 hover:text-white lg:border-t lg:border-white/10 lg:pt-4"
      >
        <Icon name="logout" size={20} className="text-mist" />
        <span className="hidden sm:inline">Log out</span>
        <span className="sr-only sm:hidden">Log out</span>
      </Link>
    </aside>
  );
}
