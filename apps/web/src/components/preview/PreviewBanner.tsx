// apps/web/src/components/preview/PreviewBanner.tsx
'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const isStandalone = () => window.self === window.top;

// 8px padding x2 + 18px line + 1px border.
const BANNER_HEIGHT = 35;

/**
 * Top-of-page notice for the Preview Site and draft mode, where unpublished (Draft) content is
 * shown. It is fixed to the top of the viewport above the site header (z-index 1000, header is 300,
 * preloader 10000). `position: sticky` does not work here because base.css sets `overflow-x: hidden`
 * on html and body, which makes body its own scroll container; so a same-height spacer in normal flow
 * keeps the site starting below the banner.
 * Hidden inside the Studio's Presentation iframe, where editors already know they are in a preview.
 * Server render assumes standalone so direct visits do not shift when the page hydrates.
 */
export function PreviewBanner() {
  const standalone = useSyncExternalStore(subscribe, isStandalone, () => true);

  if (!standalone) return null;

  return (
    <>
      <output
        style={{
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          boxSizing: 'border-box',
          height: BANNER_HEIGHT,
          background: '#fdeccb',
          color: '#8a5200',
          borderBottom: '1px solid #f5a623',
          padding: '8px 16px',
          font: '600 13px/18px sans-serif',
          textAlign: 'center',
        }}
      >
        You are viewing the Preview Site
      </output>
      <div aria-hidden="true" style={{ height: BANNER_HEIGHT }} />
    </>
  );
}
