// apps/web/src/components/modules/ServicesHeroModule.tsx
'use client';

import {
  LongArrow,
  SanityImageHero,
  TextBlock,
  Title,
} from '@/components/common';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { ServicesPageHeroModule as ServicesPageHeroModuleType } from '@/types/sanity.generated';

/**
 * Type guard to validate ServicesPageHeroModule data
 */
function isValidServicesPageHeroModule(
  data: ServicesPageHeroModuleType | null,
): data is ServicesPageHeroModuleType {
  return data !== null;
}

/**
 * Hero module component for services page
 *
 * Displays full-width hero image with title and body text.
 * Includes scroll trigger button that repositions based on viewport width.
 *
 * @param data - Services page hero module content from Sanity
 * @param onScrollTrigger - Optional callback when scroll button is clicked
 */
export function ServicesPageHeroModule({
  data,
  onScrollTrigger,
}: {
  data: ServicesPageHeroModuleType | null;
  onScrollTrigger?: () => void;
}) {
  const isWide = useMediaQuery('(min-width: 50em)');

  const bem = 'hero-card';

  // Guard: early return if no valid data
  if (!isValidServicesPageHeroModule(data)) return null;

  const { title, body, image } = data;

  // Determine which sections to render
  const hasTitle = title != null;
  const hasBody = body != null;
  const hasImage = image != null;

  /**
   * Smooth scroll to content start and trigger animations
   */
  const handleScrollClick = () => {
    const target = document.getElementById('content-start');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      onScrollTrigger?.();
    }
  };

  const scrollButton = (
    <button
      onClick={handleScrollClick}
      className={`${bem}__scroll-trigger`}
      aria-label="Scroll to content"
    >
      <LongArrow direction="down" />
    </button>
  );

  return (
    <div className={`${bem}__image-wrapper`}>
      {/* Hero Image */}
      {hasImage && (
        <SanityImageHero
          image={image}
          fill
          priority
          className={`${bem}__image`}
        />
      )}

      {/* Wide viewport: button over image */}
      {isWide && scrollButton}

      {/* Content wrapper for narrow viewport grouping */}
      <div className="content-wrapper">
        {/* Title with scroll button on narrow */}
        {hasTitle && (
          <div className={`${bem}__title-wrapper`}>
            <Title as="h1" variant="primary" className={`${bem}__title`}>
              {title}
            </Title>
          </div>
        )}

        {/* Body Text */}
        {hasBody && <TextBlock body={body} className={`${bem}__text`} />}
      </div>
    </div>
  );
}
