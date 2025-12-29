// apps/web/src/components/modules/TextImage/TextImageModule.tsx
import { SanityImage } from '@/components/common';
import { TextBlock } from '@/components/common/TextBlock';
import type { TextImageModule as TextImageModuleType } from '@/types/sanity.generated';

export function TextImageModule({
  data,
}: {
  data: TextImageModuleType | null;
}) {
  // Guard: no module data
  if (!data) return null;

  // Safe destructuring with defaults
  const { body = null, image = null } = data;

  // Guard: nothing to render
  const hasContent = Boolean(body || image);
  if (!hasContent) return null;

  return (
    <div className="container">
      {/* Image column */}
      {image && (
        <div className="row image">
          <SanityImage image={image} fill />
        </div>
      )}

      {/* Text column */}
      {body && (
        <div className="row text">
          <TextBlock body={body} className="small" />
        </div>
      )}
    </div>
  );
}
