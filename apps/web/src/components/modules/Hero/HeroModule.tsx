// apps/web/src/components/Hero/HeroModule.tsx
import {
  ClientNames,
  Title,
  TextBlock,
  SanityImage,
} from '@/components/common';
import {
  ServicesListModule,
  DeliverablesListModule,
} from '@/components/modules/ServicesList';
import type { HeroModuleType } from '@/types/sanity';

export function HeroModule({ data }: { data: HeroModuleType | null }) {
  if (!data) return null;

  const {
    title = null,
    body = null,
    image = null,
    services = [],
    deliverables = [],
    clients = [],
  } = data;

  const clientNames = clients
    .map((client) => client?.name)
    .filter((name): name is string => typeof name === 'string');

  const hasServices = services.length > 0;
  const hasDeliverables = deliverables.length > 0;
  const hasMeta = Boolean(
    body || hasServices || hasDeliverables || clientNames.length,
  );

  return (
    <>
      <div className="hero">
        {title && (
          <div className="hero-marquee">
            <Title title={title} className="heading" as="h1" />
          </div>
        )}

        {image && (
          <SanityImage
            image={image}
            width={1200}
            height={800}
            className="hero-image"
            priority
          />
        )}
      </div>

      <div className="hero-accent-bar">
        <svg width="80" height="10" viewBox="0 0 80 10" aria-hidden>
          <rect width="80" height="10" fill="#FFCC98" />
        </svg>
      </div>

      {hasMeta && (
        <div className="hero-metadata">
          <div className="flex">
            <div className="flex-item description">
              {body && <TextBlock body={body} className="medium" />}

              {clientNames.length > 0 && (
                <div className="case-study-clients">
                  <ClientNames clientNames={clientNames} />
                </div>
              )}
            </div>

            {(hasServices || hasDeliverables) && (
              <div className="flex-item services">
                <ServicesListModule services={hasServices ? services : []} />
                <DeliverablesListModule
                  deliverables={hasDeliverables ? deliverables : []}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
