import Link from "next/link";
import { appointments } from "@/content/home";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="container-page grid items-center gap-14 pt-8 pb-20 md:pt-14 md:pb-24 lg:grid-cols-2">
      <div>
        <p className="inline-flex rounded-full bg-mint px-3.5 py-2 text-sm font-semibold text-teal-700">
          Built for groomers, by people who get the chair schedule
        </p>
        <h1 id="hero-title" className="mt-6 font-display text-5xl leading-[1.02] font-extrabold tracking-[-0.03em] text-balance sm:text-6xl xl:text-[68px]">
          Fill every slot. Skip the no-shows.
        </h1>
        <p className="mt-6 max-w-[540px] text-lg leading-relaxed text-muted-foreground md:text-xl">
          Groomexa runs your grooming business — online booking, reminders, client records and payments — so you can
          spend your day on the dogs, not the diary.
        </p>
        <div className="mt-9 flex flex-wrap gap-3.5">
          <Button asChild size="xl"><Link href="#pricing">Start your free trial</Link></Button>
          <Button asChild variant="strong" size="xl"><Link href="#how-it-works">See how it works</Link></Button>
        </div>
        <p className="mt-4 text-sm text-subtle">[TRIAL TERMS — e.g. 14 days free, no card needed]</p>
      </div>
      <SchedulePreview />
    </section>
  );
}

/** Illustrative product UI: today's appointments + a booking toast. */
function SchedulePreview() {
  return (
    <figure aria-label="Preview of the Groomexa daily schedule" className="min-w-0">
      <div className="rounded-[28px] bg-ink p-5 text-cream sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-display text-[22px] font-bold">Today · Thursday</p>
          <p className="rounded-full bg-teal px-3 py-1.5 text-[13px] font-semibold">6 appointments</p>
        </div>
        <ul className="mt-5 flex flex-col gap-3">
          {appointments.map((a) => (
            <li key={a.pet} className="flex items-center gap-3.5 rounded-2xl bg-ink-800 px-4 py-3.5">
              <span aria-hidden="true" className={cn("flex size-11 shrink-0 items-center justify-center rounded-full font-bold text-ink", a.tone === "mint" ? "bg-coral" : "bg-mint")}>
                {a.pet[0]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{a.pet} · {a.service}</span>
                <span className="block truncate text-[13px] text-mist">{a.time} · {a.groomer}</span>
              </span>
              <span className={cn("hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-bold text-ink min-[400px]:inline", a.tone === "mint" ? "bg-mint" : "bg-peach")}>
                {a.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="relative -mt-5 ml-4 inline-flex items-center gap-3 rounded-2xl bg-white px-4.5 py-3.5 shadow-[0_10px_30px_rgba(14,47,46,0.15)] sm:ml-8">
        <Icon name="check" size={26} strokeWidth={2} className="text-teal" />
        <span>
          <span className="block text-[15px] font-bold">New booking from your link</span>
          <span className="block text-[13px] text-subtle">Luna · Sat 10:00 · deposit taken</span>
        </span>
      </figcaption>
    </figure>
  );
}
