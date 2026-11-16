import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/shared/icon";
import type { DashboardData } from "./service";

const percent = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 });

/** Shell shared by the four insight cards: coloured top rule, eyebrow title, icon tile. */
function InsightCard({
  title,
  icon,
  accent,
  tile,
  children,
}: {
  title: string;
  icon: IconName;
  accent: string;
  tile: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-edge bg-white p-5 shadow-[0_1px_2px_rgba(14,47,46,0.05)] sm:p-6"
    >
      <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-1", accent)} />
      <div className="flex items-start justify-between gap-3">
        <h3 className="pt-2 text-xs font-bold tracking-[0.12em] text-subtle uppercase">{title}</h3>
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tile)}>
          <Icon name={icon} size={20} />
        </span>
      </div>
      <div className="mt-5 flex flex-1 flex-col">{children}</div>
    </section>
  );
}

function Revenue({ revenue }: { revenue: DashboardData["revenue"] }) {
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: revenue.currency });
  const change = revenue.changePct;
  const up = change !== null && change >= 0;

  return (
    <InsightCard title="Revenue this month" icon="dollar" accent="bg-teal" tile="bg-mint text-teal">
      <p className="font-display text-[34px] leading-none font-semibold tracking-[-0.02em] tabular-nums">
        {money.format(revenue.thisMonth)}
      </p>
      {change === null ? (
        <p className="mt-4 text-sm text-subtle">No data for last month yet</p>
      ) : (
        <p
          className={cn(
            "mt-4 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold",
            up ? "bg-mint text-teal" : "bg-destructive/10 text-destructive",
          )}
        >
          <Icon name={up ? "trendUp" : "trendDown"} size={15} strokeWidth={2.2} />
          {up ? "+" : "−"}
          {Math.abs(change).toFixed(1)}% vs last month
        </p>
      )}
    </InsightCard>
  );
}

function PopularServices({ services }: { services: DashboardData["popularServices"] }) {
  return (
    <InsightCard title="Popular services" icon="star" accent="bg-coral" tile="bg-peach text-coral-600">
      {services.length === 0 ? (
        <p className="text-sm text-subtle">No services booked this month.</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {services.slice(0, 4).map((service, i) => (
            <li key={service.name} className="flex items-center gap-3 rounded-xl bg-cream px-3 py-2.5">
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold",
                  i === 0 ? "bg-coral text-ink" : "bg-sand text-subtle",
                )}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{service.name}</span>
              <span className="text-sm text-subtle tabular-nums">{service.count}</span>
            </li>
          ))}
        </ol>
      )}
    </InsightCard>
  );
}

function AppointmentMetrics({ metrics }: { metrics: DashboardData["appointmentMetrics"] }) {
  const rows = [
    { label: "Completion rate", value: metrics.completion, tone: "text-teal" },
    { label: "No-show rate", value: metrics.noShow, tone: "text-coral-600" },
    { label: "Cancellation rate", value: metrics.cancellation, tone: "text-ink" },
  ];

  return (
    <InsightCard title="Appointment metrics" icon="pulse" accent="bg-ink" tile="bg-sand text-ink">
      <dl className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 rounded-xl bg-cream px-3 py-2.5">
            <dt className="text-sm text-subtle">{row.label}</dt>
            <dd className={cn("text-sm font-bold tabular-nums", row.tone)}>{percent.format(row.value)}</dd>
          </div>
        ))}
      </dl>
    </InsightCard>
  );
}

function ClientActivity({ activity }: { activity: DashboardData["clientActivity"] }) {
  return (
    <InsightCard title="Client activity" icon="team" accent="bg-mist" tile="bg-mint text-teal-700">
      <p className="font-display text-[34px] leading-none font-semibold tracking-[-0.02em] tabular-nums">
        {activity.visitsThisMonth}
      </p>
      <p className="mt-2 text-sm text-subtle">Visits this month</p>
      <p className="mt-auto flex items-center gap-2 border-t border-hair pt-4 text-sm">
        <span className="font-bold text-teal tabular-nums">+{activity.newClientsThisMonth}</span>
        <span className="text-subtle">new clients</span>
      </p>
    </InsightCard>
  );
}

/** "Business insights" row: revenue, top services, appointment rates, client activity. */
export function InsightCards({ data }: { data: DashboardData }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      <Revenue revenue={data.revenue} />
      <PopularServices services={data.popularServices} />
      <AppointmentMetrics metrics={data.appointmentMetrics} />
      <ClientActivity activity={data.clientActivity} />
    </div>
  );
}
