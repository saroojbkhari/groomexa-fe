import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

/** Empty starting point. Sections get added here step by step. */
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Welcome to Groomexa" subtitle="Your salon dashboard." />
      <Card className="text-base">
        <CardContent>
          <p className="text-muted-foreground">Nothing here yet.</p>
        </CardContent>
      </Card>
    </div>
  );
}
