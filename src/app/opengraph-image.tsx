import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0E2F2E", color: "#F7F2E8" }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: "#FF8A5B" }}>{siteConfig.name}</div>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 24 }}>Fill every slot. Skip the no-shows.</div>
        <div style={{ fontSize: 32, marginTop: 32, color: "#B9CFCB" }}>Booking, reminders & payments for groomers</div>
      </div>
    ),
    size,
  );
}
