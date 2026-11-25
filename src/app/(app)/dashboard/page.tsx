import type { Metadata } from "next";
import Dashboard from "@/views/Dashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <Dashboard />;
}
