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
  draftClient,
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
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import type { ComponentType } from 'react';

type KnownModules = {
  heroModule: ComponentType<{ data: HeroModuleType }>;
  impactModule: ComponentType<{ data: ImpactModuleType }>;
  textModule: ComponentType<{ data: TextModuleType }>;
  textImageModule: ComponentType<{ data: TextImageModuleType }>;
  videoModule: ComponentType<{ data: VideoModuleType }>;
  carouselModule: ComponentType<{ data: CarouselModuleType }>;
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

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((item: any) => ({
    slug: String(item.slug),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { isEnabled } = await draftMode();
  const sanityClient = isEnabled ? draftClient : client;
  const caseStudy = await getCaseStudy(params.slug, sanityClient);

  if (!caseStudy) return {};

  return {
    title: caseStudy.title,
    openGraph: {
      title: caseStudy.title,
      type: 'article',
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const { isEnabled } = await draftMode();
  const sanityClient = isEnabled ? draftClient : client;
  const caseStudy = await getCaseStudy(params.slug, sanityClient);

  if (!caseStudy) notFound();

  const resolvedModules = caseStudy.modules?.map(resolveModuleColors) || [];
  const filteredModules = resolvedModules.filter(
    (m: any) =>
      m._type !== 'servicesModule' && m._type !== 'deliverablesModule',
  );

  return (
    <article className="case-study">
      {filteredModules.map((mod: any) => {
        const Component = moduleComponents[mod._type];
        if (!Component) return null;

        return (
          <section
            key={mod._key}
            className={`module ${toKebab(mod._type)}`}
            style={
              {
                '--module-bg': mod.backgroundColor?.hex,
                '--module-text': mod.textColor?.hex,
              } as React.CSSProperties
            }
          >
            <Component data={mod} />
          </section>
        );
      })}
    </article>
  );
}
