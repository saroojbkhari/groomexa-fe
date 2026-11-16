import Link from "next/link";
import { routes, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Brand mark. `inverted` swaps tile and dot colours for dark backgrounds. */
export function LogoMark({ size = 32, inverted = false }: { size?: number; inverted?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill={inverted ? "#F7F2E8" : "#0E2F2E"} />
      <path d="M9 21c0-6 3-10 7-10s7 4 7 10" fill="none" stroke="#FF8A5B" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="16" cy="21" r="2.4" fill={inverted ? "#0E2F2E" : "#F7F2E8"} />
    </svg>
  );
}

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <Link
      href={routes.home}
      aria-label={`${siteConfig.name} home`}
      className={cn("flex items-center gap-2.5 font-display text-[26px] font-extrabold tracking-tight", className)}
    >
      <LogoMark inverted={inverted} />
      {siteConfig.name}
    </Link>
  );
}
