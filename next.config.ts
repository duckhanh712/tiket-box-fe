import type { NextConfig } from 'next';

const API_URL = process.env.API_URL ?? 'http://localhost:3000/api';

const nextConfig: NextConfig = {
  // Browser calls same-origin `/api/*`; Next proxies to the API gateway (no CORS needed).
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_URL}/:path*` }];
  },
};

export default nextConfig;
