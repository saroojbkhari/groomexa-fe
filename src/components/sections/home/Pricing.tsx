import Link from "next/link";
import { plans } from "@/content/home";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <Section id="pricing" centered title="Simple pricing that grows with your salon.">
      <ul className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <li
            key={plan.name}
            className={cn("flex flex-col gap-4 rounded-[28px] p-8 md:p-9", plan.featured ? "bg-ink text-cream" : "bg-white")}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold">{plan.name}</h3>
              {plan.featured && (
                <span className="rounded-full bg-coral px-3 py-1 text-xs font-bold text-ink">Most popular</span>
              )}
            </div>
            <p className="font-display text-4xl font-extrabold break-words md:text-[44px]">
              {plan.price}
              <span className={cn("text-base font-medium", plan.featured ? "text-mist" : "text-subtle")}> / month</span>
            </p>
            <p className={cn("leading-normal", plan.featured ? "text-mist" : "text-muted-foreground")}>{plan.summary}</p>
            <ul className={cn("mt-2 list-disc pl-5 leading-[1.9]", plan.featured ? "text-mint" : "text-muted-foreground")}>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Button asChild variant={plan.featured ? "default" : "strong"} size="lg" className="mt-auto w-full">
              <Link href={plan.cta.href}>{plan.cta.label}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </Section>
  );
}
