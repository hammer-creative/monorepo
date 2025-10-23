// apps/web/src/pages/_app.tsx
import '@/styles/index.css';
import { DIATYPE_MEDIUM, DIATYPE_MEDIUM_ITALIC } from '@/utils/fontConfig';
import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';
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
        <ContentfulLivePreviewProvider
          locale="en-US"
          enableInspectorMode={pageProps.preview}
          enableLiveUpdates={pageProps.preview}
        >
          <Component {...pageProps} />
        </ContentfulLivePreviewProvider>
      </div>
    </>
  );
}
