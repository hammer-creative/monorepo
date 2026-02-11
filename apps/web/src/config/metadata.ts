// apps/web/src/config/metadata.ts
import type { Metadata, Viewport } from 'next';

const isStaging = process.env.CONTEXT !== 'production';

export const metadata: Metadata = {
  title: {
    default: 'Hammer Creative',
    template: '%s | Hammer Creative',
  },
  description: 'The Gaming Agency',
  applicationName: 'Hammer Creative',
  generator: 'Next.js',
  keywords: [
    'gaming agency',
    'creative agency',
    'game marketing',
    'video game marketing',
  ],
  referrer: 'origin-when-cross-origin',
  robots: isStaging
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  category: 'business',
  classification: 'Gaming Agency',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hammercreative.com',
    siteName: 'Hammer Creative',
    title: 'Hammer Creative',
    description: 'The Gaming Agency',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hammer Creative - The Gaming Agency',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hammer Creative',
    description: 'The Gaming Agency',
    creator: '@hammercreative',
    site: '@hammercreative',
    images: ['/og-image.png'],
  },
  metadataBase: new URL('https://hammercreative.com'),
  alternates: {
    canonical: '/',
  },
  authors: [{ name: 'Hammer Creative', url: 'https://hammercreative.com' }],
  creator: 'Hammer Creative',
  publisher: 'Hammer Creative',
  manifest: '/favicons/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicons/favicon.ico', sizes: 'any' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicons/favicon.ico'],
    apple: [
      {
        url: '/favicons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        url: '/favicons/apple-touch-icon-precomposed.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicons/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Hammer Creative',
    startupImage: [
      '/favicons/apple-touch-startup-image-750x1334.png',
      '/favicons/apple-touch-startup-image-1242x2208.png',
      '/favicons/apple-touch-startup-image-1125x2436.png',
    ],
  },
  other: {
    'msapplication-TileColor': '#2d89ef',
    'msapplication-config': '/favicons/browserconfig.xml',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2d89ef',
};
