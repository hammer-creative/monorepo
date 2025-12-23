// apps/web/src/app/layout.tsx
import { NavigationProvider } from '@/contexts/NavigationContext';
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://image.mux.com" />
        <link rel="dns-prefetch" href="https://stream.mux.com" />
        {/* <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --font-diatype-medium: ${DIATYPE_MEDIUM.style.fontFamily};
              --font-diatype-medium-italic: ${DIATYPE_MEDIUM_ITALIC.style.fontFamily};
              --font-mohol-regular: ${MOHOL_REGULAR.style.fontFamily};
              --font-mohol-bold: ${MOHOL_BOLD.style.fontFamily};
            }
          `,
          }}
        /> */}
      </head>
      <body
        className={`${DIATYPE_MEDIUM.variable} ${DIATYPE_MEDIUM_ITALIC.variable} ${MOHOL_REGULAR.variable} ${MOHOL_BOLD.variable}`}
      >
        <NavigationProvider>{children}</NavigationProvider>
      </body>
    </html>
  );
}
