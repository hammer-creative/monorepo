// src/app/work/[slug]/page.tsx
import {
  CarouselModule,
  HeroModule,
  ImpactModule,
  TextModule,
  TextImageModule,
  VideoModule,
} from '@/components/modules';
import {
  getCaseStudy,
  getCaseStudySlugs,
  client,
  resolveModuleColors,
} from '@/lib/sanity';
import type {
  HeroModule as HeroModuleType,
  ImpactModule as ImpactModuleType,
  TextModule as TextModuleType,
  TextImageModule as TextImageModuleType,
  VideoModule as VideoModuleType,
  CarouselModule as CarouselModuleType,
} from '@/types/sanity.generated';
import { toKebab } from '@/utils/stringUtils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ComponentType } from 'react';

// Map of module types to their React components
type KnownModules = {
  heroModule: ComponentType<{ data: HeroModuleType | null; clients?: any[] }>;
  impactModule: ComponentType<{ data: ImpactModuleType | null }>;
  textModule: ComponentType<{ data: TextModuleType | null; clients?: any[] }>;
  textImageModule: ComponentType<{ data: TextImageModuleType | null }>;
  videoModule: ComponentType<{ data: VideoModuleType | null }>;
  carouselModule: ComponentType<{ data: CarouselModuleType | null }>;
};

const knownModuleComponents: KnownModules = {
  heroModule: HeroModule,
  videoModule: VideoModule,
  textModule: TextModule,
  textImageModule: TextImageModule,
  impactModule: ImpactModule,
  carouselModule: CarouselModule,
};

const moduleComponents: Record<
  string,
  ComponentType<any>
> = knownModuleComponents;

export const revalidate = 60;

// Generate static paths for all case studies at build time
export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((item: any) => ({
    slug: String(item.slug),
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug, client);

  // Guard: Return empty metadata if case study not found
  if (!caseStudy) return {};

  const { title = 'Case Study' } = caseStudy;

  return {
    title,
    openGraph: {
      title,
      type: 'article',
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Get slug from params
  const { slug } = await params;

  // Fetch case study data
  const caseStudy = await getCaseStudy(slug, client);

  // Guard: Show 404 if case study not found
  if (!caseStudy) notFound();

  // Extract clients from document level
  const { clients = [] } = caseStudy;

  // Resolve color values and filter out service/deliverable modules
  const resolvedModules = caseStudy.modules?.map(resolveModuleColors) || [];
  const filteredModules = resolvedModules.filter(
    (m: any) =>
      m._type !== 'servicesModule' && m._type !== 'deliverablesModule',
  );

  return (
    <article className="case-study">
      {filteredModules.map((mod: any) => {
        const Component = moduleComponents[mod._type];

        // Guard: Skip unknown module types
        if (!Component) return null;

        const { _key, _type, backgroundColor, textColor } = mod;

        return (
          <section
            key={_key}
            className={`module ${toKebab(_type)}`}
            style={
              {
                '--module-bg': backgroundColor?.hex,
                '--module-text': textColor?.hex,
              } as React.CSSProperties
            }
          >
            <Component
              data={mod}
              clients={
                _type === 'heroModule' || _type === 'textModule'
                  ? clients
                  : undefined
              }
            />
          </section>
        );
      })}
    </article>
  );
}
