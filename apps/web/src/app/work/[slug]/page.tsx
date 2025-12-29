// src/app/work/[slug]/page.tsx
import {
  CarouselModule,
  HeroModule,
  ImpactModule,
  TextModule,
  TextImageModule,
  VideoModule,
} from '@/components/modules';
import { getCaseStudy, getCaseStudySlugs } from '@/lib/sanity';
import { client, draftClient } from '@/lib/sanity/client';
import { resolveModuleColors } from '@/lib/sanity/colors';
import { ModuleType } from '@/types/sanity';
import type {
  HeroModuleType,
  ImpactModuleType,
  TextModuleType,
  TextImageModuleType,
  VideoModuleType,
  CarouselModuleType,
} from '@/types/sanity';
import { toKebab } from '@/utils/stringUtils';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import type { ComponentType } from 'react';

type KnownModules = {
  [ModuleType.Hero]: ComponentType<{ data: HeroModuleType }>;
  [ModuleType.Impact]: ComponentType<{ data: ImpactModuleType }>;
  [ModuleType.Text]: ComponentType<{ data: TextModuleType }>;
  [ModuleType.TextImage]: ComponentType<{ data: TextImageModuleType }>;
  [ModuleType.Video]: ComponentType<{ data: VideoModuleType }>;
  [ModuleType.Carousel]: ComponentType<{ data: CarouselModuleType }>;
};

const knownModuleComponents: KnownModules = {
  [ModuleType.Hero]: HeroModule,
  [ModuleType.Video]: VideoModule,
  [ModuleType.Text]: TextModule,
  [ModuleType.TextImage]: TextImageModule,
  [ModuleType.Impact]: ImpactModule,
  [ModuleType.Carousel]: CarouselModule,
};

const moduleComponents: Record<
  string,
  ComponentType<any>
> = knownModuleComponents;

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((item) => ({
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
    (m) =>
      m._type !== ModuleType.Services && m._type !== ModuleType.Deliverables,
  );

  return (
    <article className="case-study">
      {filteredModules.map((mod, index) => {
        const Component = moduleComponents[mod._type];

        if (!Component) {
          console.warn(`No component found for module type "${mod._type}"`);
          return null;
        }

        const moduleClass = `module ${toKebab(mod._type)}`;
        const backgroundHex = mod.backgroundColor?.hex ?? 'transparent';
        const textHex =
          'textColor' in mod ? (mod.textColor?.hex ?? 'inherit') : 'inherit';

        return (
          <section
            key={mod._key}
            className={moduleClass}
            data-module-index={index}
            style={
              {
                '--module-bg': backgroundHex,
                '--module-text': textHex,
                backgroundColor: backgroundHex,
                color: textHex,
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
