// apps/web/src/components/Hero/HeroModule.tsx
import { SanityImage } from '@/components/common/SanityImage';
import { TextBlock } from '@/components/common/TextBlock';
import {
  ServicesModule,
  DeliverablesModule,
} from '@/components/modules/Services/ServicesModule';
import type { HeroModuleType } from '@/types/sanity';

export function HeroModule({ data }: { data: HeroModuleType }) {
  const hasServicesOrDeliverables =
    (data.services && data.services.length > 0) ||
    (data.deliverables && data.deliverables.length > 0);

  console.log('services:', data.services);
  console.log('deliverables:', data.deliverables);

  return (
    <>
      <div className="hero">
        <div className="hero-marquee">
          <h1>{data.title}</h1>
        </div>

        {data.image && (
          <SanityImage
            image={data.image}
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

      <div className="hero-metadata">
        <div className="flex">
          <div className="flex-item description">
            {data.body && <TextBlock body={data.body} className="medium" />}
            <div className="tag">Client</div>
            {data.client && (
              <p className="hero-client-name small">{data.client.name}</p>
            )}
          </div>

          {hasServicesOrDeliverables && (
            <div className="flex-item services">
              {data.services && data.services.length > 0 && (
                <ServicesModule
                  data={{
                    _type: 'servicesModule',
                    _key: 'hero-services',
                    services: data.services,
                  }}
                />
              )}
              {data.deliverables && data.deliverables.length > 0 && (
                <DeliverablesModule
                  data={{
                    _type: 'deliverablesModule',
                    _key: 'hero-deliverables',
                    deliverables: data.deliverables,
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
