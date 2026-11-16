import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { routes } from "@/config/site";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { getDashboardData } from "@/features/dashboard/service";
import { StatCards } from "@/features/dashboard/StatCards";
import { InsightCards } from "@/features/dashboard/InsightCards";
import { QuickActions } from "@/features/dashboard/QuickActions";
import { RecentActivity } from "@/features/dashboard/RecentActivity";

export const metadata: Metadata = { title: "Dashboard" };

function DashboardSection({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-[22px] font-semibold tracking-[-0.01em]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-7">
        <PageHeader
          title={`Welcome back, ${data.user.firstName}!`}
          subtitle="Here's what's happening at your grooming salon today."
          actions={
            <Button asChild>
              <Link href={routes.newVisit}>
                <Icon name="plus" size={18} strokeWidth={2.2} />
                New visit
              </Link>
            </Button>
          }
        />
        <StatCards stats={data.stats} />
      </div>

      <DashboardSection title="Business insights">
        <InsightCards data={data} />
      </DashboardSection>

      <DashboardSection title="Quick actions">
        <QuickActions />
      </DashboardSection>

      <DashboardSection
        title="Recent activity"
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href={routes.visits}>
              View all
              <Icon name="arrowRight" size={16} />
            </Link>
          </Button>
        }
      >
        <RecentActivity items={data.recentActivity} />
      </DashboardSection>
    </div>
  );
}
