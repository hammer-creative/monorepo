// apps/web/src/app/layout.tsx

import '@/styles/index.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import NextTopLoader from 'nextjs-toploader';
import { MobileMenu } from '@/components/navigation/MobileMenu';
import { DisableDraftMode } from '@/components/preview/DisableDraftMode';
import { organizationJsonLd, websiteJsonLd } from '@/config';
import { NavigationProvider } from '@/contexts/NavigationContext';
import navigationData from '@/data/navigation.json';
import { isPreviewSite } from '@/lib/sanity/server';
import type { NavigationData } from '@/types/navigation';
import {
  DIATYPE_MEDIUM,
  DIATYPE_MEDIUM_ITALIC,
  MOHOL_BOLD,
  MOHOL_REGULAR,
} from '@/utils/fontConfig';

export { metadata } from '@/config';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraftMode } = await draftMode();

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
        <>
          <NextTopLoader
            color="#FFCC98"
            initialPosition={0.08}
            crawlSpeed={200}
            height={10}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #FFCC98,0 0 5px #FFCC98"
            template='<div class="bar" role="bar"><div class="peg"></div></div>
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            zIndex={1600}
            showAtBottom={false}
          />
          <NavigationProvider>
            {children}
            <MobileMenu
              key="mobile-menu-persistent"
              navigationData={navigationData as NavigationData}
            />
          </NavigationProvider>
          {isDraftMode || isPreviewSite ? (
            <>
              <VisualEditing />
              {isDraftMode && <DisableDraftMode />}
            </>
          ) : (
            <GoogleAnalytics gaId="G-TYV27501GB" />
          )}
        </>
      </body>
    </html>
  );
}
