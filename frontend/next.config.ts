import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_API_PROXY}/api/:path*`,
      },
    ];
  }
};

export default nextConfig;
