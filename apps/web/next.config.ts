import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  distDir: '.next',
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
  async headers() {
    return [
      {
        source: '/model/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // case-study → work equivalents
      { source: '/case-study/hi-fi-rush', destination: '/work/hi-fi-rush', permanent: true },
      { source: '/case-study/starfield', destination: '/work/starfield', permanent: true },
      { source: '/case-study/indiana-jones-and-the-great-circle', destination: '/work/indiana-jones-great-circle', permanent: true },
      { source: '/case-study/magic-the-gathering-secret-lair', destination: '/work/magic-gathering-secret-lair', permanent: true },
      { source: '/case-study/forza-motorsport', destination: '/work/forza-motorsport', permanent: true },
      { source: '/case-study/metaphor-refantazio', destination: '/work/metaphor-refantazio', permanent: true },
      { source: '/case-study/kingdom-come-deliverance-ii', destination: '/work/kingdom-come-deliverance-ii', permanent: true },
      { source: '/case-study/south-of-midnight', destination: '/work/south-of-midnight', permanent: true },
      { source: '/case-study/the-elder-scrolls-iv-oblivion-remaster', destination: '/work/the-elder-scrolls-oblivion-remaster', permanent: true },
      { source: '/case-study/alan-wake-ii', destination: '/work/alan-wake-ii', permanent: true },
      { source: '/case-study/ready-or-not', destination: '/work/ready-or-not', permanent: true },
      { source: '/case-study/fortnite', destination: '/work/fortnite-social', permanent: true },
      { source: '/case-study/unreal-editor-fortnite-uefn', destination: '/work/uefn', permanent: true },
      { source: '/case-study/2xko', destination: '/work/2xko', permanent: true },
      { source: '/case-study/splitgate-2', destination: '/work/splitgate-2', permanent: true },
      { source: '/case-study/forza-horizon', destination: '/work/forza-horizon-6', permanent: true },

      // case-study → home (no equivalent)
      { source: '/case-study/cuphead', destination: '/', permanent: true },
      { source: '/case-study/doom-eternal', destination: '/', permanent: true },
      { source: '/case-study/wild-hearts', destination: '/', permanent: true },
      { source: '/case-study/pubg-awards', destination: '/', permanent: true },
      { source: '/case-study/pubg-player', destination: '/', permanent: true },
      { source: '/case-study/chivalry-2', destination: '/', permanent: true },
      { source: '/case-study/godfall', destination: '/', permanent: true },
      { source: '/case-study/killing-floor-3', destination: '/', permanent: true },
      { source: '/case-study/wayfinder', destination: '/', permanent: true },
      { source: '/case-study/elder-scrolls-castles', destination: '/', permanent: true },
      { source: '/case-study/deathloop', destination: '/', permanent: true },
      { source: '/case-study/the-callisto-protocol', destination: '/', permanent: true },
      { source: '/case-study/guardians-of-the-galaxy', destination: '/', permanent: true },
      { source: '/case-study/the-walking-dead-survivors', destination: '/', permanent: true },
      { source: '/case-study/warframe', destination: '/', permanent: true },
      { source: '/case-study/vox-machina', destination: '/', permanent: true },
      { source: '/case-study/homeworld-3-2', destination: '/', permanent: true },

      // other old WordPress URLs
      { source: '/work-listing', destination: '/work', permanent: true },
      { source: '/work-listing/', destination: '/work', permanent: true },
      { source: '/join-our-team', destination: '/', permanent: true },
      { source: '/join-our-team/', destination: '/', permanent: true },
      { source: '/about', destination: '/', permanent: true },
      { source: '/about/', destination: '/', permanent: true },
      { source: '/home', destination: '/', permanent: true },
      { source: '/home/', destination: '/', permanent: true },
      { source: '/privacy-policy', destination: '/', permanent: true },
      { source: '/privacy-policy/', destination: '/', permanent: true },

      // catch-all
      { source: '/case-study/:slug', destination: '/', permanent: true },
    ];
  },
  images: {
    loader: 'custom',
    loaderFile: './src/lib/sanity/imageLoader.ts',
    formats: ['image/avif', 'image/webp'],
    qualities: [85, 90, 95, 100],
    deviceSizes: [640, 828, 1080, 1920, 2560, 3840],
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

export default withBundleAnalyzer(nextConfig);
