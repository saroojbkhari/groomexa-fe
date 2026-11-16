import Link from "next/link";
import { navLinks, routes } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="container-page relative flex items-center justify-between gap-4 py-5 md:py-6">
      <Logo />
      <nav aria-label="Main" className="hidden gap-7 text-[15px] font-medium md:flex">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-teal">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="hidden items-center gap-2 sm:flex">
        <Link href={routes.login} className="inline-flex min-h-11 items-center rounded-full px-5 text-[15px] font-semibold hover:bg-sand">Log in</Link>
        <Button asChild variant="dark"><Link href={routes.signup}>Start free trial</Link></Button>
      </div>
      <MobileNav />
    </header>
  );
}
