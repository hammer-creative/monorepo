// apps/web/src/components/preview/LiveVisualEditing.tsx
'use client';

import { useRouter } from 'next/navigation';
import { VisualEditing } from 'next-sanity/visual-editing/client-component';
import {
  perspectiveChangeAction,
  variantChangeAction,
} from 'next-sanity/visual-editing/server-actions';

/**
 * next-sanity 13's <VisualEditing /> ignores document mutations unless it is given a `refresh`
 * handler, so Studio Presentation stops updating as editors type. This re-renders the page on every
 * mutation (the preview site fetches drafts per request) as well as on the manual refresh button.
 */
export function LiveVisualEditing() {
  const router = useRouter();

  return (
    <VisualEditing
      onPerspectiveChange={perspectiveChangeAction}
      onVariantChange={variantChangeAction}
      refresh={() => {
        router.refresh();
        return new Promise<void>((resolve) => setTimeout(resolve, 1000));
      }}
    />
  );
}
