// apps/web/src/components/preview/DisableDraftMode.tsx
'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const isStandalone = () => window.self === window.top;

/**
 * Exit-preview link for draft mode. Hidden inside the Studio's Presentation iframe, where the
 * Studio controls draft mode itself; shown when a draft-mode page is opened standalone.
 */
export function DisableDraftMode() {
  const standalone = useSyncExternalStore(subscribe, isStandalone, () => false);

  if (!standalone) return null;

  return (
    <a
      href={`/api/disable-draft?redirect=${encodeURIComponent(window.location.pathname)}`}
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 2000,
        padding: '8px 12px',
        background: '#000',
        color: '#fff',
        font: '12px/1 sans-serif',
        textDecoration: 'none',
      }}
    >
      Exit preview
    </a>
  );
}
