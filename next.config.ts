import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return ["about", "features", "pricing", "science", "blog", "privacy", "how-it-works", "join-beta", "signup", "login", "dashboard", "app", "ai-demo"].map((route) => ({
      source: `/${route}/:path*`,
      destination: "/",
      permanent: false,
    }));
  },
};

export default nextConfig;
