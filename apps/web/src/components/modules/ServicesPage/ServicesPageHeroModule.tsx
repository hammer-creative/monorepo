// apps/web/src/components/modules/ServicesHeroModule.tsx
import { Title, TextBlock, SanityImage } from '@/components/common';
import type { ServicesPageHeroModule as ServicesPageHeroModuleType } from '@/types/sanity.generated';

export function ServicesPageHeroModule({
  data,
}: {
  data: ServicesPageHeroModuleType;
}) {
  const { title, body, image } = data;

  return (
    <>
      <div className="hero">
        <div className="hero-marquee">
          {title && <Title title={title} className="heading" as="h1" />}

          {body && (
            <div className="description">
              <TextBlock body={body} className="text small" />
            </div>
          )}
        </div>

        {image && (
          <SanityImage image={image} fill className="hero-image" priority />
        )}
      </div>
    </>
  );
}
