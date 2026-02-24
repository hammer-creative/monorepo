// apps/web/src/components/modules/Hero/HeroModule.tsx
'use client';

import {
  Label,
  LongArrow,
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

const bem = 'hero-card';

function isValidHeroModule(
  data: HeroModuleType | null,
): data is HeroModuleType {
  return data !== null;
}

/**
 * HeroModule renders a full-width hero image with title, body text, and metadata.
 * Scroll trigger button repositions based on viewport width.
 * Layout differences are handled via CSS using the modifier on the wrapper.
 * Child components receive BEM element classes from the parent for layout targeting.
 *
 * @param data - HeroModule data from Sanity
 * @param data.title - Hero title text
 * @param data.body - Optional body content as PortableText
 * @param data.image - Hero image
 * @param data.services - Optional list of services
 * @param data.deliverables - Optional list of deliverables
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

  if (!isValidHeroModule(data)) return null;

  const { title, body, image, services = [], deliverables = [] } = data;

  const hasTitle = !!title;
  const hasBody = !!body;
  const hasClients = (clients ?? []).length > 0;
  const hasServices = services.length > 0;
  const hasDeliverables = deliverables.length > 0;
  const hasLists = hasServices || hasDeliverables;
  const hasSummary = hasBody || hasClients;

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
    <>
      <div className={`${bem}__image-wrapper`}>
        {/* TODO: Change image to hasImage  */}
        {image && (
          <>
            <SanityImageHero
              image={image}
              fill
              priority
              className={`${bem}__image`}
            />
            {isWide && scrollButton}
          </>
        )}
        {hasTitle && !isWide && (
          <div className={`${bem}__title-wrapper`}>
            <Title as="h1" className={`${bem}__title`}>
              {title}
            </Title>
            {scrollButton}
          </div>
        )}
        {hasTitle && isWide && (
          <Title as="h1" className={`${bem}__title`}>
            {title}
          </Title>
        )}
      </div>

      <div id="content-start" className={`${bem}__content`}>
        <div className={`${bem}__bar`} aria-hidden>
          <svg width="80" height="10" viewBox="0 0 80 10">
            <rect width="80" height="10" fill="#FFCC98" />
          </svg>
        </div>

        {(hasSummary || hasLists) && (
          <div className={`${bem}__details`}>
            {hasSummary && (
              <div className={`${bem}__summary`}>
                {hasBody && (
                  <TextBlock body={body} className={`${bem}__text`} />
                )}
                {hasClients && (
                  <Label
                    clients={clients}
                    tag="Client"
                    className={`${bem}__clients`}
                    variant="client-names"
                  />
                )}
              </div>
            )}
            {hasLists && (
              <div className={`${bem}__lists`}>
                {hasServices && <ServicesListModule services={services} />}
                {hasDeliverables && (
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
