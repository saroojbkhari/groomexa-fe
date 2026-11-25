/** Dashboard data shapes. */

export type TActivityKind = "visit" | "client" | "pet" | "payment";

export interface IDashboardData {
  user: { firstName: string };
  stats: {
    todaysAppointments: number;
    totalClients: number;
    registeredPets: number;
    totalVisits: number;
  };
  revenue: {
    /** This month, in the salon's currency (whole units, e.g. dollars). */
    thisMonth: number;
    /** Percentage change vs last month; null when there is no previous month to compare. */
    changePct: number | null;
    currency: string;
  };
  popularServices: { name: string; count: number }[];
  /** Rates as fractions of this month's appointments (0–1). */
  appointmentMetrics: { completion: number; noShow: number; cancellation: number };
  clientActivity: { visitsThisMonth: number; newClientsThisMonth: number };
  recentActivity: { id: string; kind: TActivityKind; title: string; detail: string; at: string }[];
}
