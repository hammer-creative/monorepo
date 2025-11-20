// TODO: add common title component, add common body component
// apps/web/src/components/Hero/HeroModule.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import { SanityImage } from '@/components/common/SanityImage';
import { TextBlock } from '@/components/common/TextBlock';
import {
  ServicesModule,
  DeliverablesModule,
} from '@/components/modules/Services/ServicesModule';
import type { HeroModuleType, ServicesModuleType } from '@/types/sanity';

export function HeroModule({
  data,
  services,
  deliverables,
}: {
  data: HeroModuleType;
  services: ServicesModuleType | undefined;
  deliverables: ServicesModuleType | undefined;
}) {
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

          <div className="flex-item services">
            {services && <ServicesModule data={services} />}
            {deliverables && <DeliverablesModule data={deliverables} />}
          </div>
        </div>
      </div>
    </>
  );
}
