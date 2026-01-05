// apps/web/src/components/modules/TextImage/TextImageModule.tsx
import { SanityImage } from '@/components/common';
import { TextBlock } from '@/components/common/TextBlock';
import type { TextImageModule as TextImageModuleType } from '@/types/sanity.generated';

// Type guard: Check if module data exists and is valid
function isValidTextImageModule(
  data: TextImageModuleType | null,
): data is TextImageModuleType {
  return data !== null;
}

export function TextImageModule({
  data,
}: {
  data: TextImageModuleType | null;
}) {
  // Guard: Early return if no valid data
  if (!isValidTextImageModule(data)) return null;

  // Destructure with defaults for optional fields
  const { body = null, image = null } = data;

  // Guard: Early return if no content to display
  if (!body && !image) return null;

  return (
    <div className="container">
      {/* Image Section */}
      {image && (
        <div className="row image">
          <SanityImage image={image} fill />
        </div>
      )}

      {/* Text Section */}
      {body && (
        <div className="row text">
          <TextBlock body={body} className="small" />
        </div>
      )}
    </div>
  );
}
