import type { Metadata } from "next";
import GuestRoute from "@/containers/GuestRoute";
import ForgotPassword from "@/views/ForgotPassword";

export const metadata: Metadata = { title: "Reset your password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <GuestRoute>
      <ForgotPassword />
    </GuestRoute>
  );
}
