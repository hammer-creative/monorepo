// apps/web/src/pages/_app.tsx
import { Layout } from '@/components/layout/Layout';
import { NavigationProvider } from '@/contexts/NavigationContext';
import '@/styles/index.css';
import {
  DIATYPE_MEDIUM,
  DIATYPE_MEDIUM_ITALIC,
  MOHOL_BOLD,
  MOHOL_REGULAR,
} from '@/utils/fontConfig';
import { DefaultSeo } from 'next-seo';
import SEO from 'next-seo.config';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const isStaging = process.env.CONTEXT !== 'production';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        :root {
          --font-diatype-medium: ${DIATYPE_MEDIUM.style.fontFamily};
          --font-diatype-medium-italic: ${DIATYPE_MEDIUM_ITALIC.style
            .fontFamily};
          --font-mohol-regular: ${MOHOL_REGULAR.style.fontFamily};
          --font-mohol-bold: ${MOHOL_BOLD.style.fontFamily};
        }
      `}</style>
      <div
        className={`${DIATYPE_MEDIUM.variable} ${DIATYPE_MEDIUM_ITALIC.variable}`}
      >
        {isStaging && (
          <Head>
            <meta name="robots" content="noindex, nofollow" />
          </Head>
        )}
        <NavigationProvider>
          <Layout>
            <DefaultSeo {...SEO} />
            <Component {...pageProps} />
          </Layout>
        </NavigationProvider>
      </div>
    </>
  );
}
