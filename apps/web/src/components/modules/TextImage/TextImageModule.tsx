// apps/web/src/components/modules/TextImage/TextImageModule.tsx
import { SanityImageHalfWidth, TextBlock } from '@/components/common';
import type { TextImageModule as TextImageModuleType } from '@/types/sanity.generated';

function isValidTextImageModule(
  data: TextImageModuleType | null,
): data is TextImageModuleType {
  return data !== null;
}

/**
 * TextImageModule renders a two-column card with an image and text block.
 * Layout order is controlled by DOM order via the textLeft boolean.
 * Child components receive BEM element classes from the parent for layout targeting.
 *
 * @param data - TextImageModule data from Sanity
 * @param data.body - Optional body content as PortableText
 * @param data.image - Optional image object
 * @param data.layout - Layout variant key (textLeft, textRight)
 */
export function TextImageModule({
  data,
}: {
  data: TextImageModuleType | null;
}) {
  if (!isValidTextImageModule(data)) return null;

  const { body = null, image = null, layout = null } = data;

  if (!layout || (!body && !image)) return null;

  const textLeft = layout === 'textLeft';
  const bem = 'text-image-card';

  return (
    <div className={`${bem}`}>
      {textLeft && body && <TextBlock body={body} className={`${bem}__text`} />}
      {image && (
        <SanityImageHalfWidth image={image} className={`${bem}__image`} fill />
      )}
      {!textLeft && body && (
        <TextBlock body={body} className={`${bem}__text`} />
      )}
    </div>
  );
}
