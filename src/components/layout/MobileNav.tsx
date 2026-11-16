"use client";

import Link from "next/link";
import { useRef } from "react";
import { navLinks, routes } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";

/** Mobile menu built on <details> so it works before hydration; closes after a link is tapped. */
export function MobileNav() {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => ref.current?.removeAttribute("open");

  return (
    <details ref={ref} className="md:hidden">
      <summary aria-label="Toggle menu" className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border-2 border-ink [&::-webkit-details-marker]:hidden">
        <Icon name="menu" size={22} />
      </summary>
      <nav
        aria-label="Mobile"
        onClick={close}
        className="absolute inset-x-4 top-full z-20 mt-2 flex flex-col gap-1 rounded-3xl bg-white p-4 shadow-[0_10px_30px_rgba(14,47,46,0.15)]"
      >
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-xl px-4 py-3 font-medium hover:bg-cream">
            {link.label}
          </Link>
        ))}
        <Button asChild variant="strong" className="mt-2"><Link href={routes.login}>Log in</Link></Button>
        <Button asChild variant="dark" className="mt-2"><Link href={routes.signup}>Start free trial</Link></Button>
      </nav>
    </details>
  );
}
