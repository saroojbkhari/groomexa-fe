import { routes } from "@/config/site";
import type { IAppointment, IFaqItem, IFeature, IPricingPlan, IStep } from "@/typings/content";

export const highlights = [
  "Online booking 24/7",
  "Automatic SMS & email reminders",
  "Deposits & card payments",
  "Pet & client records",
];

export const appointments: IAppointment[] = [
  { pet: "Biscuit", service: "Full groom", time: "9:00 – 10:30", groomer: "Mia Reyes", status: "Confirmed", tone: "mint" },
  { pet: "Mochi", service: "Bath & brush", time: "11:00 – 12:00", groomer: "Tom Adeyemi", status: "Deposit paid", tone: "peach" },
  { pet: "Rocky", service: "Nail trim", time: "1:30 – 2:00", groomer: "Priya Nair", status: "Reminder sent", tone: "mint" },
];

export const features: IFeature[] = [
  { icon: "calendar", title: "Smart online booking", description: "Clients pick their service, groomer and time from your own booking page. Durations adjust for breed and coat." },
  { icon: "bell", title: "Reminders that work", description: "Automatic SMS and email reminders with one-tap confirm or reschedule, so empty chairs get refilled fast." },
  { icon: "card", title: "Deposits & payments", description: "Take deposits at booking, card payments at pickup, and send receipts automatically. No more chasing." },
  { icon: "file", title: "Pet & client records", description: "Coat notes, allergies, behaviour flags, vaccination dates and before/after photos — all on one profile." },
  { icon: "team", title: "Team & commissions", description: "Individual calendars, shift patterns and commission tracking for every groomer on your team." },
  { icon: "chart", title: "Reports you'll use", description: "See revenue, rebooking rate, busiest days and top services at a glance, without a spreadsheet." },
];

export const steps: IStep[] = [
  { title: "Set up your menu", description: "Add services, prices and your team's hours. Import existing clients from a spreadsheet." },
  { title: "Share your booking link", description: "Drop it on Instagram, Google and your website. Clients book themselves, any hour of the day." },
  { title: "Let Groomexa do the rest", description: "Reminders go out, deposits come in, and rebooking prompts bring regulars back on schedule." },
];

export const plans: IPricingPlan[] = [
  {
    name: "Solo",
    price: "[YOUR PRICE]",
    summary: "For independent groomers working from one chair or van.",
    features: ["Online booking page", "SMS & email reminders", "Client & pet records"],
    cta: { label: "Start free trial", href: `${routes.signup}?plan=solo` },
  },
  {
    name: "Studio",
    price: "[YOUR PRICE]",
    summary: "For growing salons with a small team.",
    features: ["Everything in Solo", "Deposits & card payments", "Multi-groomer calendars", "Reports & commissions"],
    cta: { label: "Start free trial", href: `${routes.signup}?plan=studio` },
    featured: true,
  },
  {
    name: "Multi-location",
    price: "[YOUR PRICE]",
    summary: "For chains and franchises needing central control.",
    features: ["Everything in Studio", "Multiple locations", "Priority support"],
    cta: { label: "Talk to us", href: routes.contact },
  },
];

export const faqs: IFaqItem[] = [
  { question: "Can I import my existing clients?", answer: "Yes. Upload a spreadsheet and Groomexa maps names, contacts and pet details for you." },
  { question: "Do my clients need to download an app?", answer: "No. They book and manage appointments from a simple web link on any phone." },
  { question: "How do deposits work?", answer: "Set a deposit per service. It's collected at booking and applied to the final bill. [CONFIRM POLICY DETAILS]" },
  { question: "Can I cancel any time?", answer: "Yes — no contracts. [CONFIRM CANCELLATION TERMS]" },
];
