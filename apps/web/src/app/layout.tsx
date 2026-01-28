// apps/web/src/app/layout.tsx
import { MobileMenu } from '@/components/navigation/MobileMenu';
import { NavigationProvider } from '@/contexts/NavigationContext';
import navigationData from '@/data/navigation.json';
import type { NavigationData } from '@/types/navigation';

import '@/styles/index.css';

import {
  DIATYPE_MEDIUM,
  DIATYPE_MEDIUM_ITALIC,
  MOHOL_BOLD,
  MOHOL_REGULAR,
} from '@/utils/fontConfig';
import type { Metadata } from 'next';

const isStaging = process.env.CONTEXT !== 'production';

export const metadata: Metadata = {
  title: 'Hammer Creative',
  description: 'Gaming agency',
  robots: isStaging ? 'noindex, nofollow' : undefined,
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`
        ${DIATYPE_MEDIUM.variable}
        ${DIATYPE_MEDIUM_ITALIC.variable}
        ${MOHOL_REGULAR.variable}
        ${MOHOL_BOLD.variable}
      `}
    >
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://image.mux.com" />
        <link rel="dns-prefetch" href="https://stream.mux.com" />
      </head>
      <body>
        <NavigationProvider>
          {children}
          <MobileMenu
            key="mobile-menu-persistent"
            navigationData={navigationData as NavigationData}
          />
        </NavigationProvider>
      </body>
    </html>
  );
}
