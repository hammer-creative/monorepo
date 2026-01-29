// apps/web/src/components/modules/Hero/HeroModule.tsx
import { SanityHeroImage } from '@/components/common';
import type { SingleImageModule as SingleImageModuleType } from '@/types/sanity.generated';

// Type guard: Check if module data exists and is valid
function isValidSingleImageModule(
  data: SingleImageModuleType | null,
): data is SingleImageModuleType {
  return data !== null;
}

export function SingleImageModule({
  data,
}: {
  data: SingleImageModuleType | null;
}) {
  // Guard: Early return if no valid data
  if (!isValidSingleImageModule(data)) return null;

  // Destructure module data
  const { image } = data;

  // Derive helper flags
  const hasImage = image != null;

  return (
    <div className="wrapper">
      {/* Single Image: Image */}
      <div className="row single-image">
        <div className="content">
          {hasImage && (
            <div className="image">
              <SanityHeroImage image={image} fill priority />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
