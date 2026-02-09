// apps/web/src/components/modules/TextImage/TextImageModule.tsx
import { SanityImage, TextBlock } from '@/components/common';
import type { TextImageModule as TextImageModuleType } from '@/types/sanity.generated';

type Layout = NonNullable<TextImageModuleType['layout']>;

const LAYOUT_CLASS_MAP: Record<Layout, string> = {
  textLeft: 'text-left',
  textRight: 'text-right',
} as const;

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

  // Derive layout class and helper flags
  const layoutClass = LAYOUT_CLASS_MAP[layout] ?? '';
  const hasBody = body != null;
  const hasImage = image != null;

  return (
    <section className={`module text-image-module ${layoutClass}`}>
      {/* Image */}
      {hasImage && (
        <div className="image">
          <SanityImage image={image} fill />
        </div>
      )}

      {/* Body */}
      {hasBody && (
        <div className="body">
          <TextBlock body={body} />
        </div>
      )}
    </section>
  );
}
