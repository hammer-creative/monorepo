// apps/web/src/components/preview/PreviewBanner.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const isStandalone = () => window.self === window.top;

// 8px padding x2 + 18px line + 1px border.
const BANNER_HEIGHT = 35;

type Status = 'draft' | 'published' | 'other';

// Colors match the Draft / Published badges in the Studio and the editor guide.
const STYLES: Record<Status, { text: string; background: string; color: string; border: string }> =
  {
    draft: {
      text: 'You are viewing a draft page on the preview site',
      background: '#fdeccb',
      color: '#8a5200',
      border: '#f5a623',
    },
    published: {
      text: 'You are viewing a published page on the preview site',
      background: '#d7f5e1',
      color: '#1d7a43',
      border: '#43d675',
    },
    other: {
      text: 'You are viewing the preview site',
      background: '#eceef2',
      color: '#444a57',
      border: '#c9cdd6',
    },
  };

/**
 * Top-of-page notice for the Preview Site and draft mode. Orange when the current page has
 * unpublished changes, green when it matches the published version. Status comes from
 * `/api/preview-status`.
 *
 * It is fixed to the top of the viewport above the site header (z-index 1000, header is 300,
 * preloader 10000). `position: sticky` does not work here because base.css sets `overflow-x: hidden`
 * on html and body, which makes body its own scroll container; so a same-height spacer in normal flow
 * keeps the site starting below the banner.
 * Hidden inside the Studio's Presentation iframe, where editors already know they are in a preview.
 * Server render assumes standalone so direct visits do not shift when the page hydrates.
 */
export function PreviewBanner() {
  const standalone = useSyncExternalStore(subscribe, isStandalone, () => true);
  const pathname = usePathname() ?? '/';
  const [status, setStatus] = useState<Status>('other');

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch(`/api/preview-status?path=${encodeURIComponent(pathname)}`, { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { status?: Status } | null) => {
          if (!cancelled && data?.status) setStatus(data.status);
        })
        .catch(() => {});
    load();
    // Editors switch tabs to publish in the Studio, so re-check when they come back.
    window.addEventListener('focus', load);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', load);
    };
  }, [pathname]);

  if (!standalone) return null;

  const { text, background, color, border } = STYLES[status];

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
          background,
          color,
          borderBottom: `1px solid ${border}`,
          padding: '8px 16px',
          font: '600 13px/18px sans-serif',
          textAlign: 'center',
        }}
      >
        {text}
      </output>
      <div aria-hidden="true" style={{ height: BANNER_HEIGHT }} />
    </>
  );
}
