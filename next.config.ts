import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    outputFileTracingIncludes: {
      '/**/*': ['./prisma.config.ts'],
    },
  },
};

export default nextConfig;
