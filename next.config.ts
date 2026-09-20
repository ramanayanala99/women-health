import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the Base44 preview origin to load dev assets / HMR.
  allowedDevOrigins: [
    "3000-" + (process.env.BASE44_PUBLIC_HOST_SUFFIX ?? ""),
  ].filter(Boolean),
};

export default nextConfig;
