// apps/web/src/components/Hero/HeroModule.tsx
// import { HeroCopy } from './HeroCopy';
// import { HeroHeadline } from './HeroHeadline';
import { SanityImage } from '@/components/common/SanityImage';
import type { HeroModuleType } from '@/types/sanity';
import { HeroImage } from './HeroImage';

export function HeroModule({ data }: { data: HeroModuleType }) {
  const image = data.image;
  const width = image?.metadata?.dimensions?.width ?? 800;
  const height = image?.metadata?.dimensions?.height ?? 600;
  const hex = data.backgroundColor?.hex;

  console.log('HeroModule data:', data);
  return (
    <div className="hero">
      <div
        className="hero-marquee"
        style={{ backgroundColor: hex || 'transparent' }}
      >
        <h1>{data.title}</h1>
      </div>
      {image?.url && (
        <SanityImage
          url={image.url}
          alt={image.alt || ''}
          width={width}
          height={height}
          className="hero-image"
          priority
        />
      )}
      {/* <HeroImage image={data.image} /> */}
      {/* Example future usage:
      <HeroHeadline text={data.headline} />
      <HeroCopy text={data.copy} />
      <HeroImage image={data.image} /> */}
    </div>
  );
}
