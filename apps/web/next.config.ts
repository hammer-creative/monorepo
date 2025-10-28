import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
    deviceSizes: [576, 768, 992, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/lpg4lrp82d8t/**',
      },
    ],
  },
  webpack: (config) => {
    // Add configuration to handle SVGs with @svgr/webpack
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export const sizes = nextConfig.images?.deviceSizes ?? [];

export default nextConfig;
