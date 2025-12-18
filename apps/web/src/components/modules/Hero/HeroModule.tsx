// apps/web/src/components/Hero/HeroModule.tsx
import {
  ClientNames,
  Title,
  TextBlock,
  SanityHeroImage,
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

  // Normalize clients to array
  const clientsArray = Array.isArray(clients) ? clients : [clients];

  const clientNames = clientsArray
    .map((client) => client?.name)
    .filter((name): name is string => typeof name === 'string');

  const hasServices = services.length > 0;
  const hasDeliverables = deliverables.length > 0;
  const hasMeta = Boolean(
    body || hasServices || hasDeliverables || clientNames.length,
  );

  return (
    <>
      <div className="row marquee">
        {/* Image */}
        {image && (
          <div className="image">
            <SanityHeroImage image={image} fill priority />
          </div>
        )}

        {/* Title */}
        {title && (
          <div className="text">
            <Title title={title} as="h1" />
          </div>
        )}
      </div>

      {/* Accent */}
      <div className="row bar">
        <svg width="80" height="10" viewBox="0 0 80 10" aria-hidden>
          <rect width="80" height="10" fill="#FFCC98" />
        </svg>
      </div>

      {/* Metadata */}
      {hasMeta && (
        <div className="row meta">
          <div className="text">
            {body && <TextBlock body={body} className="medium" />}

            {clientNames.length > 0 && (
              <div className="clients">
                <ClientNames clientNames={clientNames} />
              </div>
            )}
          </div>

          {(hasServices || hasDeliverables) && (
            <div className="services">
              <ServicesListModule services={hasServices ? services : []} />
              <DeliverablesListModule
                deliverables={hasDeliverables ? deliverables : []}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
