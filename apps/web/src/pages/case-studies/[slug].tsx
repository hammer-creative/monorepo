// apps/web/src/pages/case-studies/[slug].tsx
import {
  HeroModule,
  // VideoModule,
  TextImageModule,
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
  [ModuleType.TextImage]: TextImageModule,
  // [ModuleType.Impact]: ImpactModule,
};

// allow unknown modules without crashing
const moduleComponents: Record<
  string,
  ComponentType<any>
> = knownModuleComponents;

// TEMPORARY: Color hex mapping until Sanity solution is implemented
// TEMPORARY: Color hex mapping until Sanity solution is implemented
const COLORS = {
  stealth: '#141515',
  aircutter: '#C7D3D3',
  alloy: '#778888',
  nimbus: '#C7D3D3',
  hyperbeam: '#0066CC',
} as const;

function resolveBackgroundColor(
  backgroundColor: { enabled: boolean; color: string } | null | undefined,
) {
  if (!backgroundColor?.enabled || !backgroundColor?.color) {
    return null;
  }

  return {
    enabled: true,
    name: backgroundColor.color,
    hex: COLORS[backgroundColor.color as keyof typeof COLORS],
  };
}

export default function CaseStudyPage({ caseStudy }: Props) {
  // TEMPORARY: Resolve backgroundColor hex for all modules
  const resolvedModules = caseStudy.modules.map((mod) => {
    if ('backgroundColor' in mod && mod.backgroundColor) {
      return {
        ...mod,
        backgroundColor: resolveBackgroundColor(mod.backgroundColor),
      };
    }
    return mod;
  });

  return (
    <>
      <NextSeo
        title={caseStudy.title}
        titleTemplate="%s | Hammer Creative"
        openGraph={{ title: caseStudy.title, type: 'article' }}
      />
      <article>
        {resolvedModules.map((mod) => {
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
  console.log(
    'backgroundColor from Sanity:',
    JSON.stringify(caseStudy.modules[0]?.backgroundColor, null, 2),
  );

  return { props: { caseStudy }, revalidate: 60 };
};
