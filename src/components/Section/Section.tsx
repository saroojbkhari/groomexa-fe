import type { ReactNode } from "react";
import { cn } from "@/utils/common";

type SectionProps = {
  id: string;
  title: ReactNode;
  eyebrow?: string;
  centered?: boolean;
  className?: string;
  children: ReactNode;
};

/** Page section with an accessible h2 heading (linked via aria-labelledby). */
export default function Section({ id, title, eyebrow, centered, className, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("container-page scroll-mt-6 pt-20 pb-10 md:pt-28", className)}>
      <div className={cn("max-w-[680px]", centered && "mx-auto text-center")}>
        {eyebrow && <p className="text-sm font-bold tracking-[0.08em] text-teal uppercase">{eyebrow}</p>}
        <h2 id={`${id}-title`} className="mt-3 font-display text-4xl leading-[1.08] font-extrabold tracking-tight text-balance md:text-5xl">
          {title}
        </h2>
      </div>
      <div className="mt-10 md:mt-14">{children}</div>
    </section>
  );
}
