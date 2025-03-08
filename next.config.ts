import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['assignment.devotel.io'],
  },
  // add proxy to avoid CORS issues
  async rewrites() {
    return [
      {
        source: '/api/external/:path*',
        destination: 'https://assignment.devotel.io/api/:path*',
      },
    ];
  },
};

export default nextConfig;
