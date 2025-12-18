// apps/web/src/components/SanityVisualEditing.tsx
import { draftClient } from '@/lib/sanity/client';
// import { useLiveMode } from '@sanity/react-loader';
import { VisualEditing } from '@sanity/visual-editing/next-pages-router';
import { DisableDraftMode } from './DisableDraftMode';

export default function SanityVisualEditing() {
  // useLiveMode({ client: draftClient });

  return (
    <>
      <VisualEditing />
      <DisableDraftMode />
    </>
  );
}
