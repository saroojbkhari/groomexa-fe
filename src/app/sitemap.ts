import type { MetadataRoute } from "next";
import { routes, siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}${routes.signup}`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}${routes.login}`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
