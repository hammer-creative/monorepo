import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

// Netlify sets CONTEXT to 'branch-deploy' for non-production branches
const isStaging = process.env.CONTEXT !== 'production';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
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
    </>
  );
}
