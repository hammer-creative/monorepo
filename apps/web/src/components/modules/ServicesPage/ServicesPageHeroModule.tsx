// apps/web/src/components/modules/ServicesHeroModule.tsx
import { Title, TextBlock, SanityImage } from '@/components/common';
import type { ServicesPageHeroModule as ServicesPageHeroModuleType } from '@/types/sanity.generated';

// Type guard: Check if module data exists and is valid
function isValidServicesPageHeroModule(
  data: ServicesPageHeroModuleType | null,
): data is ServicesPageHeroModuleType {
  return data !== null;
}

export function ServicesPageHeroModule({
  data,
}: {
  data: ServicesPageHeroModuleType | null;
}) {
  // Guard: Early return if no valid data
  if (!isValidServicesPageHeroModule(data)) return null;

  // Destructure with defaults for optional fields
  const { title = null, body = null, image = null } = data;

  return (
    <div className="hero">
      {/* Hero Content: Title + Body */}
      <div className="hero-marquee">
        {title && <Title title={title} className="heading" as="h1" />}

        {body && (
          <div className="description">
            <TextBlock body={body} className="text small" />
          </div>
        )}
      </div>

      {/* Hero Image */}
      {image && (
        <SanityImage image={image} fill className="hero-image" priority />
      )}
    </div>
  );
}
