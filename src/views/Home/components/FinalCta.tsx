import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="container-page py-20 md:py-28">
      <div className="flex flex-col items-center gap-6 rounded-[36px] bg-ink px-6 py-14 text-center text-cream md:px-12 md:py-[72px]">
        <h2 id="cta-title" className="max-w-[720px] font-display text-4xl leading-[1.05] font-extrabold tracking-tight md:text-[52px]">
          Give your diary a day off.
        </h2>
        <p className="max-w-[520px] text-lg leading-relaxed text-mist md:text-[19px]">
          Try Groomexa free and see how much calmer a fully booked week can feel.
        </p>
        <Button asChild size="xl"><Link href="#pricing">Start your free trial</Link></Button>
      </div>
    </section>
  );
}
