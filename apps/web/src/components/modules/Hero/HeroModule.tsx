// apps/web/src/components/modules/Hero/HeroModule.tsx
import { Label, SanityHeroImage, TextBlock, Title } from '@/components/common';
import {
  DeliverablesListModule,
  ServicesListModule,
} from '@/components/modules/ServicesList';
import type {
  Client,
  HeroModule as HeroModuleType,
} from '@/types/sanity.generated';

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
  clients?: Client[] | null;
}) {
  if (!isValidHeroModule(data)) return null;

  const { title, body, image, services = [], deliverables = [] } = data;

  const clientNames = (clients ?? [])
    .map((c) => c?.name)
    .filter((name): name is string => typeof name === 'string');

  const hasHeader = !!title;
  const hasMeta = !!body || clientNames.length > 0;
  const hasLists = services.length > 0 || deliverables.length > 0;

  console.log(title);

  return (
    <>
      {image && (
        <div className="image">
          <SanityHeroImage image={image} fill priority />
        </div>
      )}

      <div className="content">
        {hasHeader && (
          <div className="header">
            <Title as="h1" variant="primary">
              {title}
            </Title>
          </div>
        )}

        <div className="bar" aria-hidden>
          <svg width="80" height="10" viewBox="0 0 80 10">
            <rect width="80" height="10" fill="#FFCC98" />
          </svg>
        </div>

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
