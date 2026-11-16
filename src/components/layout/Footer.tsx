import Link from "next/link";
import { routes, siteConfig } from "@/config/site";

const footerLinks = [
  { label: "Privacy", href: routes.privacy },
  { label: "Terms", href: routes.terms },
  { label: "Contact", href: routes.contact },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-4 py-9 text-sm text-subtle sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="font-display text-xl font-extrabold text-ink">{siteConfig.name}</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-6">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
        <p>© 2026 {siteConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
