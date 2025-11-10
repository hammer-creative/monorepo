// apps/web/src/pages/case-studies/[slug].tsx
// apps/web/src/pages/case-studies/[slug].tsx
import {
  HeroModule,
  VideoModule,
  TextModule,
  TextImageModule,
  ImpactModule,
} from '@/components/modules';
import { getCaseStudy, getCaseStudySlugs } from '@/lib/sanity';
import { resolveBackgroundColor } from '@/lib/sanity/colors';
import { ModuleType } from '@/types/sanity';
import type {
  CaseStudy,
  Module,
  HeroModuleType,
  ImpactModuleType,
  TextModuleType,
  TextImageModuleType,
  VideoModuleType,
} from '@/types/sanity';
import { toKebab } from '@/utils/stringUtils';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import type { ComponentType } from 'react';

// ✅ import shared resolver

interface Props {
  caseStudy: CaseStudy;
}

type KnownModules = {
  [ModuleType.Hero]: ComponentType<{ data: HeroModuleType }>;
  [ModuleType.Impact]: ComponentType<{ data: ImpactModuleType }>;
  [ModuleType.Text]: ComponentType<{ data: TextModuleType }>;
  [ModuleType.TextImage]: ComponentType<{ data: TextImageModuleType }>;
  [ModuleType.Video]: ComponentType<{ data: VideoModuleType }>;
};

// known modules
const knownModuleComponents: KnownModules = {
  [ModuleType.Hero]: HeroModule,
  [ModuleType.Video]: VideoModule,
  [ModuleType.Text]: TextModule,
  [ModuleType.TextImage]: TextImageModule,
  [ModuleType.Impact]: ImpactModule,
};

// allow unknown modules without crashing
const moduleComponents: Record<
  string,
  ComponentType<any>
> = knownModuleComponents;

export default function CaseStudyPage({ caseStudy }: Props) {
  // ✅ Use shared color resolver
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
      <article className="case-study">
        {resolvedModules.map((mod) => {
          const Component = moduleComponents[mod._type];
          if (!Component) {
            console.warn(`No component found for module type "${mod._type}"`);
            return null;
          }

          // derive clean classes
          const moduleClass = `module ${mod._type
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase()}`;

          return (
            <section
              key={mod._key}
              className={moduleClass}
              style={{
                backgroundColor: mod.backgroundColor?.hex ?? 'transparent',
              }}
            >
              <Component
                data={mod as Extract<Module, { _type: typeof mod._type }>}
              />
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
