import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    suppressHydrationWarning: true,
  },
};

export default nextConfig;
