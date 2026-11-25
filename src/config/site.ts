export const siteConfig = {
  name: "Groomexa",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://groomexa.com",
  title: "Groomexa — Dog Grooming Salon Software & Online Booking",
  description:
    "Groomexa is all-in-one dog grooming software: online booking, automatic SMS & email reminders, deposits, card payments and pet records. Fill every slot and cut no-shows.",
  keywords: [
    "dog grooming software",
    "grooming salon software",
    "pet grooming booking app",
    "online booking for groomers",
    "grooming appointment reminders",
    "mobile grooming software",
    "pet salon management",
  ],
  locale: "en_US",
  themeColor: "#0E2F2E",
} as const;

export const routes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  /** Target of the link in the verification email (the backend's APP_URL + this path). */
  verifyEmail: "/verify-email",
  app: "/dashboard",
  /** App screens linked from the dashboard; pages not built yet. */
  clients: "/clients",
  pets: "/pets",
  visits: "/visits",
  newVisit: "/visits/new",
  calendar: "/calendar",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;
