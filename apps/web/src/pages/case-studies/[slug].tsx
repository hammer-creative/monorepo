// apps/web/src/pages/case-studies/[slug].tsx
import {
  HeroModule,
  // VideoModule,
  // TextImageModule,
  // ImpactModule,
} from '@/components/modules';
import { getCaseStudy, getCaseStudySlugs } from '@/lib/sanity';
import { ModuleType } from '@/types/sanity';
import type {
  CaseStudy,
  Module,
  HeroModuleType,
  VideoModuleType,
  TextImageModuleType,
  ImpactModuleType,
} from '@/types/sanity';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import type { ComponentType } from 'react';

interface Props {
  caseStudy: CaseStudy;
}

type KnownModules = {
  [ModuleType.Hero]: ComponentType<{ data: HeroModuleType }>;
  [ModuleType.Video]: ComponentType<{ data: VideoModuleType }>;
  [ModuleType.TextImage]: ComponentType<{ data: TextImageModuleType }>;
  [ModuleType.Impact]: ComponentType<{ data: ImpactModuleType }>;
};

// known modules
const knownModuleComponents: KnownModules = {
  [ModuleType.Hero]: HeroModule,
  // [ModuleType.Video]: VideoModule,
  // [ModuleType.TextImage]: TextImageModule,
  // [ModuleType.Impact]: ImpactModule,
};

// allow unknown modules without crashing
const moduleComponents: Record<
  string,
  ComponentType<any>
> = knownModuleComponents;

export default function CaseStudyPage({ caseStudy }: Props) {
  return (
    <>
      <NextSeo
        title={caseStudy.title}
        titleTemplate="%s | Hammer Creative"
        openGraph={{ title: caseStudy.title, type: 'article' }}
      />
      <article>
        {caseStudy.modules.map((mod) => {
          const Component = moduleComponents[mod._type];
          if (!Component) {
            console.warn(`No component found for module type "${mod._type}"`);
            return null;
          }
          return (
            <Component
              key={mod._key}
              data={mod as Extract<Module, { _type: typeof mod._type }>}
            />
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
        slug: typeof item.slug === 'string' ? item.slug : item.slug?.current,
      },
    })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slugParam = params?.slug;
  const slug =
    typeof slugParam === 'string'
      ? slugParam
      : Array.isArray(slugParam)
        ? slugParam[0]
        : '';

  const caseStudy = await getCaseStudy(slug);
  if (!caseStudy) return { notFound: true };
  return { props: { caseStudy }, revalidate: 60 };
};
