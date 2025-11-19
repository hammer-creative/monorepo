// TODO: add common title component, add common body component
// apps/web/src/components/Hero/HeroModule.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import { SanityImage } from '@/components/common/SanityImage';
import { TextBlock } from '@/components/common/TextBlock';
import { DeliverablesModule } from '@/components/modules/Services/DeliverablesModule';
import { ServicesModule } from '@/components/modules/Services/ServicesModule';
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

      <div className="hero-description">
        <div className="flex">
          <div className="flex-item">
            <svg width="80" height="10" viewBox="0 0 80 10">
              <rect
                width="80"
                height="10"
                fill="#FFCC98"
                className="hero-accent-bar"
              />
            </svg>
            {data.body && <TextBlock body={data.body} className="medium" />}
            <div className="tag">Client</div>
            {data.client && (
              <div className="hero-client-name">{data.client.name}</div>
            )}
          </div>

          <div className="flex-item">
            {services && <ServicesModule data={services} />}
            {deliverables && <DeliverablesModule data={deliverables} />}
          </div>
        </div>
      </div>
    </>
  );
}
