// apps/web/src/app/layout.tsx
import { MobileMenu } from '@/components/navigation/MobileMenu';
import { organizationJsonLd, websiteJsonLd } from '@/config';
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

export { metadata } from '@/config';

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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
