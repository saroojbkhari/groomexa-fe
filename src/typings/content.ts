import type { IconName } from "@/components/Icon";

export type IFeature = { icon: IconName; title: string; description: string };

export type IStep = { title: string; description: string };

export type IPricingPlan = {
  name: string;
  price: string;
  summary: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

export type IFaqItem = { question: string; answer: string };

export type IAppointment = {
  pet: string;
  service: string;
  time: string;
  groomer: string;
  status: string;
  tone: "mint" | "peach";
};
