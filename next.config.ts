import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Performance optimizations */
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/7.x/**',
      },
    ],
  },
  // Enable React strict mode for better error detection
  reactStrictMode: true,
};

export default nextConfig;
