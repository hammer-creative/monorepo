// apps/web/src/components/Hero/HeroModule.tsx
import { Title, TextBlock, SanityImage } from '@/components/common';
import {
  ServicesModule,
  DeliverablesModule,
} from '@/components/modules/Services/ServicesModule';
import type { HeroModuleType } from '@/types/sanity';

export function HeroModule({ data }: { data: HeroModuleType }) {
  const { title, body, image, client, services, deliverables } = data;

  const hasServicesOrDeliverables =
    (services && services.length > 0) ||
    (deliverables && deliverables.length > 0);

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
        <svg width="80" height="10" viewBox="0 0 80 10">
          <rect width="80" height="10" fill="#FFCC98" />
        </svg>
      </div>

      {(body || hasServicesOrDeliverables) && (
        <div className="hero-metadata">
          <div className="flex">
            <div className="flex-item description">
              <TextBlock body={body} className="medium" />
              {client && (
                <>
                  <div className="tag">Client</div>
                  <p className="hero-client-name small">{client.name}</p>
                </>
              )}
            </div>

            {hasServicesOrDeliverables && (
              <div className="flex-item services">
                <ServicesModule services={services} />
                <DeliverablesModule deliverables={deliverables} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
