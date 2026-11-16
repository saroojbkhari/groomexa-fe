import type { IconName } from "@/components/shared/icon";

export type Feature = { icon: IconName; title: string; description: string };

export type Step = { title: string; description: string };

export type PricingPlan = {
  name: string;
  price: string;
  summary: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

export type FaqItem = { question: string; answer: string };

export type Appointment = {
  pet: string;
  service: string;
  time: string;
  groomer: string;
  status: string;
  tone: "mint" | "peach";
};
