// apps/web/src/components/modules/Hero/HeroModule.tsx
import {
  ClientNames,
  SanityHeroImage,
  TextBlock,
  Title,
} from '@/components/common';
import {
  DeliverablesListModule,
  ServicesListModule,
} from '@/components/modules/ServicesList';
import type {
  Client,
  HeroModule as HeroModuleType,
} from '@/types/sanity.generated';

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
  clients?: Client[];
}) {
  // Guard: Early return if no valid data
  if (!isValidHeroModule(data)) return null;

  // Destructure module data
  const { title, body, image, services = [], deliverables = [] } = data;

  // Extract valid client names
  const clientNames = clients
    .map((c) => c?.name)
    .filter((name): name is string => typeof name === 'string');

  // Derive helper flags
  const hasTitle = title != null;
  const hasBody = body != null;
  const hasImage = image != null;
  const hasServices = services.length > 0;
  const hasDeliverables = deliverables.length > 0;
  const hasClients = clientNames.length > 0;
  const hasMeta = hasBody || hasServices || hasDeliverables || hasClients;

  return (
    <div className="wrapper">
      {/* Hero Section: Image + Title */}
      <div className="row marquee">
        <div className="content">
          {hasImage && (
            <div className="image">
              <SanityHeroImage image={image} fill priority />
            </div>
          )}

          {hasTitle && (
            <div className="text">
              <Title title={title} as="h1" />
            </div>
          )}
        </div>
      </div>

      {/* Metadata Section: Body + Clients + Services/Deliverables */}
      {hasMeta && (
        <div className="row meta">
          <div className="bar">
            <svg
              width="80"
              height="10"
              viewBox="0 0 80 10"
              aria-hidden
              style={{ display: 'block' }}
            >
              <rect width="80" height="10" fill="#FFCC98" />
            </svg>
          </div>
          <div className="content">
            <div className="text">
              {hasBody && <TextBlock body={body} className="medium" />}

              {hasClients && (
                <div className="clients">
                  <ClientNames clientNames={clientNames} />
                </div>
              )}
            </div>

            {(hasServices || hasDeliverables) && (
              <div className="services">
                {hasServices && <ServicesListModule services={services} />}
                {hasDeliverables && (
                  <DeliverablesListModule deliverables={deliverables} />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
