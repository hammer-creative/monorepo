// apps/web/src/components/modules/ServicesHeroModule.tsx
import { SanityHeroImage, TextBlock, Title } from '@/components/common';
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

  // Destructure module data
  const { title, body, image } = data;

  // Derive helper flags
  const hasTitle = title != null;
  const hasBody = body != null;
  const hasImage = image != null;

  return (
    <div className="wrapper">
      {/* Hero Section: Title + Body */}
      <div className="row marquee">
        <div className="content">
          {/* Hero Image */}
          {hasImage && (
            <div className="image">
              <SanityHeroImage image={image} fill priority />
            </div>
          )}
          {hasTitle && hasBody && (
            <div className="meta">
              <Title title={title} as="h1" />
              <TextBlock body={body} className="text small" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
