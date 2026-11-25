import { cn } from "@/utils/common";
import Icon, { type IconName } from "@/components/Icon";
import type { TActivityKind, IDashboardData } from "@/typings/dashboard";

const KIND: Record<TActivityKind, { icon: IconName; tile: string }> = {
  visit: { icon: "scissors", tile: "bg-mint text-teal" },
  client: { icon: "user", tile: "bg-sand text-teal-700" },
  pet: { icon: "paw", tile: "bg-peach text-coral-600" },
  payment: { icon: "dollar", tile: "bg-mint text-teal-700" },
};

const when = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

/** Latest events across the salon, newest first. */
export default function RecentActivity({ items }: { items: IDashboardData["recentActivity"] }) {
  return (
    <div className="rounded-2xl border border-edge bg-white shadow-[0_1px_2px_rgba(14,47,46,0.05)]">
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-sand text-subtle">
            <Icon name="clock" size={22} />
          </span>
          <p className="font-semibold">No activity yet</p>
          <p className="max-w-sm text-sm text-subtle">Visits, new clients and payments will show up here as they happen.</p>
        </div>
      ) : (
        <ul className="divide-y divide-hair">
          {items.map((item) => {
            const kind = KIND[item.kind];
            return (
              <li key={item.id} className="flex items-center gap-4 px-4 py-4 sm:px-6">
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", kind.tile)}>
                  <Icon name={kind.icon} size={20} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold">{item.title}</p>
                    <p className="truncate text-sm text-subtle">{item.detail}</p>
                  </div>
                  <time dateTime={item.at} className="mt-1 shrink-0 text-xs font-medium text-subtle tabular-nums sm:mt-0">
                    {when.format(new Date(item.at))}
                  </time>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
