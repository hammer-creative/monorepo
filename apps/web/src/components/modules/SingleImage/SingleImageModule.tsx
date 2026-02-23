// apps/web/src/components/modules/Hero/HeroModule.tsx
import { SanityImageFullWidth } from '@/components/common';
import type { SingleImageModule as SingleImageModuleType } from '@/types/sanity.generated';

const bem = 'single-image-card';

function isValidSingleImageModule(
  data: SingleImageModuleType | null,
): data is SingleImageModuleType {
  return data !== null;
}

/**
 * SingleImageModule renders a full-width image block.
 *
 * @param data - SingleImageModule data from Sanity
 * @param data.image - Full width image
 */
export function SingleImageModule({
  data,
}: {
  data: SingleImageModuleType | null;
}) {
  if (!isValidSingleImageModule(data)) return null;

  const { image } = data;

  if (!image) return null;

  return (
    <div className={bem}>
      <SanityImageFullWidth image={image} className={`${bem}__image`} />
    </div>
  );
}
