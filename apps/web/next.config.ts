// apps/web/next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: '.next', // Explicitly set this
  compiler: {
    removeConsole: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  crossOrigin: 'anonymous',
  images: {
    loader: 'custom',
    loaderFile: './src/lib/sanity/imageLoader.ts',
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90, 95, 100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'image.mux.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export const sizes = nextConfig.images?.deviceSizes ?? [];

export default nextConfig;
