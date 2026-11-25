import type { IDashboardData } from "@/typings/dashboard";

/**
 * Sample dashboard data (demo). Replace with a call in src/api/dashboard.ts once the backend has the endpoint.
 */
export async function getDashboardData(): Promise<IDashboardData> {
  return {
    user: { firstName: "Sarooj" },
    stats: { todaysAppointments: 4, totalClients: 128, registeredPets: 163, totalVisits: 942 },
    revenue: { thisMonth: 6840.5, changePct: 12.4, currency: "USD" },
    popularServices: [
      { name: "Full groom", count: 38 },
      { name: "Bath & brush", count: 27 },
      { name: "Nail trim", count: 19 },
      { name: "Conditioner", count: 11 },
    ],
    appointmentMetrics: { completion: 0.91, noShow: 0.04, cancellation: 0.05 },
    clientActivity: { visitsThisMonth: 86, newClientsThisMonth: 9 },
    recentActivity: [
      { id: "a1", kind: "visit", title: "Visit completed", detail: "Biscuit (Cavapoo) · Full groom", at: "2026-11-16T10:20:00" },
      { id: "a2", kind: "payment", title: "Payment received", detail: "$85.00 from Hannah Lee", at: "2026-11-16T10:24:00" },
      { id: "a3", kind: "pet", title: "New pet added", detail: "Mochi (Shih Tzu) for Omar Farooq", at: "2026-11-16T09:05:00" },
      { id: "a4", kind: "client", title: "New client", detail: "Priya Nair signed up via online booking", at: "2026-11-15T17:42:00" },
    ],
  };
}
