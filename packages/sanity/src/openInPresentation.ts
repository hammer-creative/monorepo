// packages/sanity/src/openInPresentation.ts
import { DesktopIcon } from '@sanity/icons';
import { type DocumentActionComponent } from 'sanity';
import { useRouter } from 'sanity/router';

// The "Used on one page" link in the document header goes through Studio intent resolution and does
// nothing here. This navigates straight to /presentation/<type>/<id>?preview=<page>, the same URL
// Presentation uses itself.
export const openInPresentation: DocumentActionComponent = ({ id, type, draft, published }) => {
  const router = useRouter();
  const slug = (draft ?? published)?.slug as { current?: string } | undefined;
  if (type !== 'caseStudy' || !slug?.current) return null;
  const preview = `/work/${slug.current}`;

  return {
    label: 'Open in Presentation',
    icon: DesktopIcon,
    onHandle: () => {
      const base = router.resolvePathFromState({ tool: 'presentation' });
      router.navigateUrl({
        path: `${base.replace(/\/$/, '')}/${type}/${id.replace(/^drafts\./, '')}?preview=${encodeURIComponent(preview)}`,
      });
    },
  };
};
