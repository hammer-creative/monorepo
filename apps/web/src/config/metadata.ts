// apps/web/src/config/metadata.ts
import type { Metadata, Viewport } from 'next';

const isStaging = process.env.CONTEXT !== 'production';

/**
 * Base metadata merged into every page. Handles SEO, social cards, favicons,
 * PWA config, and staging noindex. Consumed directly by the root layout and
 * extended per-page via `buildMetadata`.
 */
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
    creator: '@HammerCreative',
    site: '@HammerCreative',
    images: ['/og-image.png'],
  },
  metadataBase: new URL('https://hammercreative.com'),
  alternates: {
    canonical: '/',
  },
  authors: [{ name: 'Hammer Creative', url: 'https://hammercreative.com' }],
  creator: 'Hammer Creative',
  publisher: 'Hammer Creative',
  icons: {
    icon: [
      { url: '/favicons/favicon.ico', sizes: 'any' },
      { url: '/favicons/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicons/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicons/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicons/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: ['/favicons/favicon.ico'],
    apple: [
      {
        url: '/favicons/apple-touch-icon.png',
        type: 'image/png',
        sizes: '180x180',
      },
      {
        url: '/favicons/apple-touch-icon-precomposed.png',
        type: 'image/png',
        sizes: '180x180',
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

/**
 * Builds per-page metadata by merging a page title into the base config.
 * The title template in the base metadata will produce `"<title> | Hammer Creative"`.
 *
 * @param title - The page-level title, e.g. `"Services"` or `"Work"`.
 */
export function buildMetadata(title: string): Metadata {
  return {
    title,
    openGraph: {
      ...metadata.openGraph,
      title: `${title} | Hammer Creative`,
    },
  };
}

/**
 * Viewport config shared across all pages. Exported separately per Next.js
 * App Router requirements — viewport cannot be nested inside `metadata`.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2d89ef',
};
