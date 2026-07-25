import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // En Vercel, vercel.json maneja la redirección /api/* hacia backend/vercel-handler.ts
    if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
      return [];
    }
    // Solo proxy en desarrollo local hacia el servidor NestJS (puerto 3001)
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

export default nextConfig;
