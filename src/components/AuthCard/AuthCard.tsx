import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/** Form card used by every auth page: one h1, optional intro, form, footer links. */
export default function AuthCard({ title, intro, footer, children }: { title: string; intro?: ReactNode; footer?: ReactNode; children: ReactNode }) {
  return (
    <div className="w-full max-w-[440px]">
      <Card className="gap-7 rounded-[28px] py-6 text-base shadow-[0_10px_30px_rgba(14,47,46,0.08)] ring-0 sm:py-9 [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(9)]">
        <CardHeader className="gap-2">
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{title}</h1>
          {intro && <p className="text-muted-foreground">{intro}</p>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
      {footer && <p className="mt-6 text-center text-[15px] text-muted-foreground">{footer}</p>}
    </div>
  );
}
