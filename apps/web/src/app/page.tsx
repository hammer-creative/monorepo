import { Masthead } from '@/components/common/Masthead';
import Scene from '@/components/common/Scene';
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
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import type { ComponentType } from 'react';

interface HomePageData {
  homePage: HomePageType | null;
  draftMode: boolean;
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

export const metadata: Metadata = {
  title: 'Home',
  openGraph: {
    title: 'Home',
    type: 'website',
  },
};

export const revalidate = 60;

async function getHomePageData(): Promise<HomePageData> {
  const draft = await draftMode();
  const sanityClient = draft.isEnabled ? draftClient : client;
  const homePage = await getHomePage(sanityClient);
  return { homePage, draftMode: draft.isEnabled };
}

export default async function HomePage() {
  const { homePage, draftMode: isDraftMode } = await getHomePageData();

  if (!homePage) return null;

  const resolvedModules = homePage.modules?.map(resolveModuleColors) || [];

  return (
    <div className="container">
      <div className="marquee">
        <Masthead />
        <Scene />
      </div>
      {resolvedModules.map((mod, index) => {
        const Component = moduleComponents[mod._type];

        if (!Component) {
          console.warn(`No component found for module type "${mod._type}"`);
          return null;
        }

        const moduleClass = `module ${toKebab(mod._type)}`;
        const textHex =
          'textColor' in mod ? (mod.textColor?.hex ?? 'inherit') : 'inherit';

        return (
          <section
            key={mod._key}
            className={moduleClass}
            data-module-index={index}
            style={
              {
                '--module-text': textHex,
                color: textHex,
              } as React.CSSProperties
            }
          >
            <Component data={mod} />
          </section>
        );
      })}
    </div>
  );
}
