// apps/web/src/components/preview/PreviewBanner.tsx
'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const isStandalone = () => window.self === window.top;

/**
 * Top-of-page notice for the Preview Site and draft mode, where unpublished (Draft) content is
 * shown. It sticks to the top of the viewport above the site header (z-index 1000, header is 300,
 * preloader 10000). It sits in normal flow, so the site starts below it rather than under it.
 * Hidden inside the Studio's Presentation iframe, where editors already know they are in a preview.
 * Server render assumes standalone so direct visits do not shift when the page hydrates.
 */
export function PreviewBanner() {
  const standalone = useSyncExternalStore(subscribe, isStandalone, () => true);

  if (!standalone) return null;

  return (
    <output
      style={{
        display: 'block',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: '#fdeccb',
        color: '#8a5200',
        borderBottom: '1px solid #f5a623',
        padding: '8px 16px',
        font: '600 13px/1.4 sans-serif',
        textAlign: 'center',
      }}
    >
      You are viewing a Draft
    </output>
  );
}
