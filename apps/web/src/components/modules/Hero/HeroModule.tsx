// apps/web/src/components/Hero/HeroModule.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import { SanityImage } from '@/components/common/SanityImage';
import type { HeroModuleType } from '@/types/sanity';

export function HeroModule({ data }: { data: HeroModuleType }) {
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
        <div className="hero-accent-bar">
          <svg width="80" height="10" viewBox="0 0 80 10">
            <rect width="80" height="10" fill="#FFCC98" />
          </svg>
        </div>
        {data.body && (
          <PortableTextRenderer value={data.body} className="medium" />
        )}
        {data.client && (
          <>
            <div className="tag">Client</div>
            <div>{data.client.name}</div>
          </>
        )}
      </div>
    </>
  );
}
