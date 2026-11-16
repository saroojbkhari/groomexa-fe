import Link from "next/link";
import type { Metadata } from "next";
import { routes } from "@/config/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="container-page flex min-h-dvh flex-col items-center justify-center gap-6 text-center">
      <h1 className="font-display text-5xl font-extrabold">Page not found</h1>
      <p className="text-lg text-muted-foreground">This page doesn&apos;t exist yet.</p>
      <Button asChild size="xl"><Link href={routes.home}>Back to home</Link></Button>
    </main>
  );
}
