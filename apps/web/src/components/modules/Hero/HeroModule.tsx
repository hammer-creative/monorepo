// TODO: remove mq and replace with pure css

// .scroll-trigger {
//   /* mobile: hidden */
//   display: none;
// }

// @media (min-width: 60em) {
//   .scroll-trigger {
//     display: block;
//   }
// }

// apps/web/src/components/modules/Hero/HeroModule.tsx
'use client';

import {
  ArrowDown,
  Label,
  SanityImageHero,
  TextBlock,
  Title,
} from '@/components/common';
import {
  DeliverablesListModule,
  ServicesListModule,
} from '@/components/modules/ServicesList';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type {
  Client,
  HeroModule as HeroModuleType,
} from '@/types/sanity.generated';

/**
 * Type guard to validate HeroModule data
 */
function isValidHeroModule(
  data: HeroModuleType | null,
): data is HeroModuleType {
  return data !== null;
}

/**
 * Hero module component for case study pages
 * Displays full-width hero image with title, body text, and metadata
 * Includes scroll trigger button that repositions based on viewport width
 *
 * @param data - Hero module content from Sanity
 * @param clients - Array of client data
 * @param onScrollTrigger - Optional callback when scroll button is clicked
 */
export function HeroModule({
  data,
  clients = [],
  onScrollTrigger,
}: {
  data: HeroModuleType | null;
  clients?: Client[] | null;
  onScrollTrigger?: () => void;
}) {
  const isWide = useMediaQuery('(min-width: 50em)');

  // Guard: early return if no valid data
  if (!isValidHeroModule(data)) return null;

  const { title, body, image, services = [], deliverables = [] } = data;

  // Extract client names from client data
  const clientNames = (clients ?? [])
    .map((c) => c?.name)
    .filter((name): name is string => typeof name === 'string');

  // Determine which sections to render
  const hasTitle = !!title;
  const hasMeta = !!body || clientNames.length > 0;
  const hasLists = services.length > 0 || deliverables.length > 0;

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

  // Scroll trigger button
  const scrollButton = (
    <button
      onClick={handleScrollClick}
      className={`scroll-trigger ${isWide ? 'wide' : 'narrow'}`}
      aria-label="Scroll to content"
    >
      <ArrowDown />
    </button>
  );

  return (
    <>
      <div className="header">
        {image && (
          <div className="image">
            <SanityImageHero image={image} fill priority />
            {isWide && scrollButton}
          </div>
        )}

        {hasTitle && !isWide && (
          <div className="title-container">
            <Title as="h1" variant="primary">
              {title}
            </Title>
            {scrollButton}
          </div>
        )}

        {hasTitle && isWide && (
          <Title as="h1" variant="primary">
            {title}
          </Title>
        )}
      </div>

      <div id="content-start" className="content">
        {/* Decorative bar */}
        <div className="bar" aria-hidden>
          <svg width="80" height="10" viewBox="0 0 80 10">
            <rect width="80" height="10" fill="#FFCC98" />
          </svg>
        </div>
        {/* Body text, clients, and lists */}
        {(hasMeta || hasLists) && (
          <div className="meta">
            {hasMeta && (
              <div className="body">
                {body && <TextBlock body={body} variant="hero" />}
                {clientNames.length > 0 && (
                  <div className="clients">
                    <Label variant="client-label">Client</Label>
                    <Label clients={clientNames} variant="client-name" />
                  </div>
                )}
              </div>
            )}

            {hasLists && (
              <div className="lists">
                {services.length > 0 && (
                  <ServicesListModule services={services} />
                )}
                {deliverables.length > 0 && (
                  <DeliverablesListModule deliverables={deliverables} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
