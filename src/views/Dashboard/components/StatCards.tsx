import { cn } from "@/utils/common";
import Icon, { type IconName } from "@/components/Icon";
import type { IDashboardData } from "@/typings/dashboard";

type Tone = "mint" | "peach" | "sand" | "featured";

const toneClass: Record<Tone, { card: string; tile: string }> = {
  mint: { card: "bg-white text-ink", tile: "bg-mint text-teal" },
  peach: { card: "bg-white text-ink", tile: "bg-peach text-coral-600" },
  sand: { card: "bg-white text-ink", tile: "bg-sand text-teal-700" },
  featured: { card: "bg-ink text-cream border-ink", tile: "bg-white/10 text-coral" },
};

const number = new Intl.NumberFormat("en-US");

/** Headline counts across the top of the dashboard. */
export default function StatCards({ stats }: { stats: IDashboardData["stats"] }) {
  const items: { label: string; value: number; icon: IconName; tone: Tone }[] = [
    { label: "Today's appointments", value: stats.todaysAppointments, icon: "calendar", tone: "mint" },
    { label: "Total clients", value: stats.totalClients, icon: "team", tone: "sand" },
    { label: "Registered pets", value: stats.registeredPets, icon: "paw", tone: "peach" },
    { label: "Total visits", value: stats.totalVisits, icon: "pulse", tone: "featured" },
  ];

  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {items.map((item) => {
        const tone = toneClass[item.tone];
        return (
          <li
            key={item.label}
            className={cn(
              "flex flex-col rounded-2xl border border-edge p-4 shadow-[0_1px_2px_rgba(14,47,46,0.05)] sm:p-6",
              tone.card,
            )}
          >
            <span className={cn("grid size-11 place-items-center rounded-xl sm:size-12", tone.tile)}>
              <Icon name={item.icon} size={22} />
            </span>
            <span className="mt-5 font-display text-[32px] leading-none font-semibold tracking-[-0.02em] tabular-nums sm:mt-6 sm:text-[38px]">
              {number.format(item.value)}
            </span>
            <span className={cn("mt-2 text-sm font-medium", item.tone === "featured" ? "text-mist" : "text-subtle")}>
              {item.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
