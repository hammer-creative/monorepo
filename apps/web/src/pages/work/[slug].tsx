// apps/web/src/pages/work/[slug].tsx
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
  CaseStudy,
  HeroModuleType,
  ImpactModuleType,
  TextModuleType,
  TextImageModuleType,
  VideoModuleType,
  CarouselModuleType,
} from '@/types/sanity';
import { toKebab } from '@/utils/stringUtils';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import type { ComponentType } from 'react';

interface Props {
  caseStudy: CaseStudy;
  draftMode?: boolean;
}

type KnownModules = {
  [ModuleType.Hero]: ComponentType<{ data: HeroModuleType }>;
  [ModuleType.Impact]: ComponentType<{ data: ImpactModuleType }>;
  [ModuleType.Text]: ComponentType<{
    data: TextModuleType;
    clientName?: string;
  }>;
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

export default function CaseStudyPage({ caseStudy }: Props) {
  if (!caseStudy) return null;

  const resolvedModules = caseStudy.modules?.map(resolveModuleColors) || [];

  const filteredModules = resolvedModules.filter(
    (m) =>
      m._type !== ModuleType.Services && m._type !== ModuleType.Deliverables,
  );

  const heroModule = filteredModules.find(
    (m) => m._type === ModuleType.Hero,
  ) as HeroModuleType | undefined;
  const clientName = heroModule?.client?.name;

  return (
    <>
      <NextSeo
        title={caseStudy.title}
        titleTemplate="%s | Hammer Creative"
        openGraph={{ title: caseStudy.title, type: 'article' }}
      />

      <article className="page case-study">
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

          const componentProps =
            mod._type === ModuleType.Text
              ? { data: mod, clientName }
              : { data: mod };

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
              <Component {...(componentProps as any)} />
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
      params: { slug: String(item.slug) },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { params, draftMode = false } = context;
  const slug = params?.slug as string;

  if (!slug) return { notFound: true };

  const sanityClient = draftMode ? draftClient : client;
  const caseStudy = await getCaseStudy(slug, sanityClient);

  if (!caseStudy) return { notFound: true };

  return {
    props: {
      caseStudy,
      draftMode,
    },
    revalidate: 60,
  };
};
