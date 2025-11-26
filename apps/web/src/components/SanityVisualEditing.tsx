// apps/web/src/components/SanityVisualEditing.tsx
import { client } from '@/lib/sanity/client';
import { useLiveMode } from '@sanity/react-loader';
import { VisualEditing } from '@sanity/visual-editing/next-pages-router';
import { DisableDraftMode } from './DisableDraftMode';

const stegaClient = client.withConfig({
  stega: {
    enabled: true,
    studioUrl: 'http://localhost:3333', // Changed from 3000 to 3333
  },
});

export default function SanityVisualEditing() {
  console.log('=== VISUAL EDITING MOUNTED ===');
  console.log('=== STEGA CLIENT CONFIG:', stegaClient.config());

  useLiveMode({ client: stegaClient });

  return (
    <>
      <VisualEditing />
      <DisableDraftMode />
    </>
  );
}
