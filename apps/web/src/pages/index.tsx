// apps/web/src/pages/index.tsx
import { CaseStudyCardModule, TextModule } from '@/components/modules';
import {
  client,
  draftClient,
  getHomePage,
  resolveModuleColors,
} from '@/lib/sanity';
import { ModuleType } from '@/types/sanity';
import type {
  HomePageType,
  CaseStudyCardModuleType,
  TextModuleType,
} from '@/types/sanity';
import { toKebab } from '@/utils/stringUtils';
import type { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import type { ComponentType } from 'react';

interface Props {
  homePage: HomePageType;
  draftMode?: boolean;
}

type KnownModules = {
  [ModuleType.CaseStudyCard]: ComponentType<{ data: CaseStudyCardModuleType }>;
  [ModuleType.Text]: ComponentType<{ data: TextModuleType }>;
};

const knownModuleComponents: KnownModules = {
  [ModuleType.CaseStudyCard]: CaseStudyCardModule,
  [ModuleType.Text]: TextModule,
};

const moduleComponents: Record<
  string,
  ComponentType<any>
> = knownModuleComponents;

export default function HomePage({ homePage }: Props) {
  if (!homePage) return null;

  const resolvedModules = homePage.modules?.map(resolveModuleColors) || [];

  return (
    <>
      <NextSeo
        title="Home"
        titleTemplate="%s | Hammer Creative"
        openGraph={{ title: 'Home', type: 'website' }}
      />

      <article>
        {resolvedModules.map((mod, index) => {
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
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { draftMode = false } = context;
  const sanityClient = draftMode ? draftClient : client;
  const homePage = await getHomePage(sanityClient);

  if (!homePage) return { notFound: true };

  return {
    props: {
      homePage,
      draftMode,
    },
    revalidate: 60,
  };
};
