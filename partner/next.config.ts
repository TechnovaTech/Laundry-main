import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  experimental: {
    suppressHydrationWarning: true,
  },
};

export default nextConfig;
