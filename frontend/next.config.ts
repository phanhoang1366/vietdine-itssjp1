import type { NextConfig } from "next";

const apiRewriteOrigin =
  process.env.INTERNAL_API_URL ||
  process.env.SERVER_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3001';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiRewriteOrigin}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
  devIndicators: false,
};

export default nextConfig;
