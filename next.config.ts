import type { NextConfig } from "next";

/**
 * Backend base URL, used by the browser (so it's NEXT_PUBLIC_ and inlined at build time; it isn't a secret).
 * Fail the build early if it's missing. See .env.example.
 */
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set. Add it to .env (see .env.example), e.g. NEXT_PUBLIC_API_URL=http://localhost:3000");
}

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
