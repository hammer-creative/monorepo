// apps/web/src/components/Hero/HeroModule.tsx
import type { HeroModuleType } from '@/types/sanity';

// import { HeroCopy } from './HeroCopy';
// import { HeroHeadline } from './HeroHeadline';
// import { HeroImage } from './HeroImage';

export function HeroModule({ data }: { data: HeroModuleType }) {
  console.log(data);
  return (
    <section className="hero-module">
      <h2>{data.heading}</h2>
      {/* Example future usage:
      <HeroHeadline text={data.headline} />
      <HeroCopy text={data.copy} />
      <HeroImage image={data.image} /> */}
    </section>
  );
}
