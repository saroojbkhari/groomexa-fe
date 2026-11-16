import type { ReactNode } from "react";

/** Screen title (the page's h1) with optional subtitle and actions. */
export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-[30px] leading-tight font-semibold tracking-[-0.02em] md:text-[36px]">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-[15px] text-subtle">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
