// apps/web/src/pages/work/[slug].tsx
import {
  CarouselModule,
  DeliverablesModule,
  HeroModule,
  ImpactModule,
  TextModule,
  TextImageModule,
  ServicesModule,
  VideoModule,
} from '@/components/modules';
import { getCaseStudy, getCaseStudySlugs } from '@/lib/sanity';
import { resolveModuleColors } from '@/lib/sanity/colors';
import { ModuleType } from '@/types/sanity';
import type {
  CaseStudy,
  Module,
  HeroModuleType,
  ImpactModuleType,
  TextModuleType,
  TextImageModuleType,
  VideoModuleType,
  CarouselModuleType,
  ServicesModuleType,
} from '@/types/sanity';
import { toKebab } from '@/utils/stringUtils';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import type { ComponentType } from 'react';

interface Props {
  caseStudy: CaseStudy;
}

type KnownModules = {
  [ModuleType.Hero]: ComponentType<{ data: HeroModuleType }>;
  [ModuleType.Impact]: ComponentType<{ data: ImpactModuleType }>;
  [ModuleType.Text]: ComponentType<{ data: TextModuleType }>;
  [ModuleType.TextImage]: ComponentType<{ data: TextImageModuleType }>;
  [ModuleType.Video]: ComponentType<{ data: VideoModuleType }>;
  [ModuleType.Carousel]: ComponentType<{ data: CarouselModuleType }>;
  [ModuleType.Services]: ComponentType<{ data: ServicesModuleType }>;
  [ModuleType.Deliverables]: ComponentType<{ data: ServicesModuleType }>;
};

const knownModuleComponents: KnownModules = {
  [ModuleType.Hero]: HeroModule,
  [ModuleType.Video]: VideoModule,
  [ModuleType.Text]: TextModule,
  [ModuleType.TextImage]: TextImageModule,
  [ModuleType.Impact]: ImpactModule,
  [ModuleType.Carousel]: CarouselModule,
  [ModuleType.Services]: ServicesModule,
  [ModuleType.Deliverables]: DeliverablesModule,
};

const moduleComponents: Record<
  string,
  ComponentType<any>
> = knownModuleComponents;

export default function CaseStudyPage({ caseStudy }: Props) {
  const resolvedModules = caseStudy.modules.map(resolveModuleColors);

  // --- EXTRACT SERVICES + DELIVERABLES ---
  const services = resolvedModules.find(
    (m) => m._type === ModuleType.Services,
  ) as ServicesModuleType | undefined;

  const deliverables = resolvedModules.find(
    (m) => m._type === ModuleType.Deliverables,
  ) as ServicesModuleType | undefined;

  // --- REMOVE THEM FROM THE LOOP ---
  const filteredModules = resolvedModules.filter(
    (m) =>
      m._type !== ModuleType.Services && m._type !== ModuleType.Deliverables,
  );

  return (
    <>
      <NextSeo
        title={caseStudy.title}
        titleTemplate="%s | Hammer Creative"
        openGraph={{ title: caseStudy.title, type: 'article' }}
      />

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
                  backgroundColor: backgroundHex, // Set it directly here
                  color: textHex,
                } as React.CSSProperties
              }
            >
              {mod._type === ModuleType.Hero ? (
                <HeroModule
                  data={mod as HeroModuleType}
                  services={services}
                  deliverables={deliverables}
                />
              ) : (
                <Component data={mod as any} />
              )}
            </section>
          );
        })}
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getCaseStudySlugs();
  return {
    paths: slugs.map((item) => ({
      params: {
        slug: item.slug,
      },
    })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;

  if (!slug) return { notFound: true };

  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) return { notFound: true };

  return {
    props: { caseStudy },
    revalidate: 60,
  };
};
