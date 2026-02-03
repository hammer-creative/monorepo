// apps/web/src/components/modules/TextImage/TextImageModule.tsx
import { SanityImage } from '@/components/common';
import { TextBlock } from '@/components/common/TextBlock';
import type { TextImageModule as TextImageModuleType } from '@/types/sanity.generated';

// Layout type from generated schema
type Layout = NonNullable<TextImageModuleType['layout']>;

// Map layout values to CSS class names
const LAYOUT_CLASS_MAP: Record<Layout, string> = {
  textLeft: 'text-left',
  textRight: 'text-right',
} as const;

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

  // Destructure module data
  const { body = null, image = null, layout = null } = data;

  // Guard: Early return if no layout or no content
  if (!layout || (!body && !image)) return null;

  // Guard: Early return if no content to display
  if (!body && !image) return null;

  // Derive layout class and helper flags
  const layoutClass = LAYOUT_CLASS_MAP[layout] ?? '';
  const hasBody = body != null;
  const hasImage = image != null;

  return (
    <div className={`wrapper ${layoutClass}`}>
      {/* Image Section */}
      {hasImage && (
        <div className="row image">
          <SanityImage image={image} fill />
        </div>
      )}

      {/* Text Section */}
      {hasBody && (
        <div className="row text">
          <div className="content">
            <TextBlock body={body} className="small" />
          </div>
        </div>
      )}
    </div>
  );
}
