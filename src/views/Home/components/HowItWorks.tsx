import { steps } from "@/constants/home";
import Section from "@/components/Section";

export default function HowItWorks() {
  return (
    <Section id="how-it-works" title="Up and running before your next appointment.">
      <ol className="grid gap-10 md:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title}>
            <span aria-hidden="true" className="flex size-14 items-center justify-center rounded-full bg-coral font-display text-2xl font-extrabold">
              {i + 1}
            </span>
            <h3 className="mt-5 mb-2 font-display text-[26px] font-bold">{step.title}</h3>
            <p className="leading-relaxed text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
