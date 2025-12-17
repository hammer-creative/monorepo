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
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 85, 90, 100],
    deviceSizes: [576, 768, 992, 1200],
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
