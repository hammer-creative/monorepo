// apps/web/src/components/modules/ServicesHeroModule.tsx
'use client';

import {
  ArrowDown,
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

  return (
    <div className="header">
      {/* Hero Image */}
      {hasImage && (
        <div className="image">
          <SanityImageHero image={image} fill priority />
        </div>
      )}

      {/* Wide viewport: button over image */}
      {isWide && (
        <button
          onClick={handleScrollClick}
          className="scroll-trigger wide"
          aria-label="Scroll to content"
        >
          <ArrowDown />
        </button>
      )}

      {/* Content wrapper for narrow viewport grouping */}
      <div className="content-wrapper">
        {/* Title with scroll button on narrow */}
        {hasTitle && (
          <div className="title-container">
            <Title as="h1" variant="primary">
              {title}
            </Title>
            {!isWide && (
              <button
                onClick={handleScrollClick}
                className="scroll-trigger narrow"
                aria-label="Scroll to content"
              >
                <ArrowDown />
              </button>
            )}
          </div>
        )}

        {/* Body Text */}
        {hasBody && (
          <div className="body">
            <TextBlock body={body} variant="small" />
          </div>
        )}
      </div>
    </div>
  );
}
