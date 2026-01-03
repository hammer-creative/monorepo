// apps/web/src/components/modules/Hero/HeroModule.tsx
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
import type { HeroModule as HeroModuleType } from '@/types/sanity.generated';

// Type guard: Check if module data exists and is valid
function isValidHeroModule(
  data: HeroModuleType | null,
): data is HeroModuleType {
  return data !== null;
}

export function HeroModule({
  data,
  clients = [],
}: {
  data: HeroModuleType | null;
  clients?: any[];
}) {
  // Guard: Early return if no valid data
  if (!isValidHeroModule(data)) return null;

  // Destructure with defaults for optional fields
  const {
    title = null,
    body = null,
    image = null,
    services = [],
    deliverables = [],
  } = data;

  // Extract client names
  const clientNames = clients
    .map((c: any) => c?.name)
    .filter((name): name is string => typeof name === 'string');

  // Compute module visibility flags
  const hasServices = services.length > 0;
  const hasDeliverables = deliverables.length > 0;
  const hasClients = clientNames.length > 0;
  const hasMeta = Boolean(body || hasServices || hasDeliverables || hasClients);

  return (
    <>
      {/* Hero Section: Image + Title */}
      <div className="row marquee">
        {image && (
          <div className="image">
            <SanityHeroImage image={image} fill priority />
          </div>
        )}

        {title && (
          <div className="text">
            <Title title={title} as="h1" />
          </div>
        )}
      </div>

      {/* Accent Bar */}
      <div className="row bar">
        <svg width="80" height="10" viewBox="0 0 80 10" aria-hidden>
          <rect width="80" height="10" fill="#FFCC98" />
        </svg>
      </div>

      {/* Metadata Section: Body + Clients + Services/Deliverables */}
      {hasMeta && (
        <div className="row meta">
          <div className="text">
            {body && <TextBlock body={body} className="medium" />}

            {hasClients && (
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
