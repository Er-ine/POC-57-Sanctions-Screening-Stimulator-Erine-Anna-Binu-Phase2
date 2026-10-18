import type { NextConfig } from "next";

const apiInternalUrl =
  process.env.API_INTERNAL_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/cases/:path*",
        destination: `${apiInternalUrl}/cases/:path*`,
      },
      {
        source: "/stats",
        destination: `${apiInternalUrl}/stats`,
      },
      {
        source: "/screen",
        destination: `${apiInternalUrl}/screen`,
      },
      {
        source: "/export/:path*",
        destination: `${apiInternalUrl}/export/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${apiInternalUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
