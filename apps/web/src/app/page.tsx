import { Masthead } from '@/components/common/Masthead';
import Scene from '@/components/common/Scene';
import { CaseStudyCardModule, TextModule } from '@/components/modules';
import {
  client,
  draftClient,
  getHomePage,
  resolveModuleColors,
} from '@/lib/sanity';
import type {
  CaseStudyCardModule as CaseStudyCardModuleType,
  HomePage as HomePageType,
  TextModule as TextModuleType,
} from '@/types/sanity.generated';
import { toKebab } from '@/utils/stringUtils';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import type { ComponentType } from 'react';

interface HomePageData {
  homePage: HomePageType | null;
  draftMode: boolean;
}

type KnownModules = {
  caseStudyCardModule: ComponentType<{ data: CaseStudyCardModuleType }>;
  textModule: ComponentType<{ data: TextModuleType }>;
};

const knownModuleComponents: KnownModules = {
  caseStudyCardModule: CaseStudyCardModule,
  textModule: TextModule,
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
        const textColorName =
          'textColor' in mod && mod.textColor?.enabled && mod.textColor?.name
            ? mod.textColor.name
            : null;

        return (
          <section
            key={mod._key}
            className={moduleClass}
            data-module-index={index}
            data-text-color={textColorName || undefined}
          >
            <Component data={mod} />
          </section>
        );
      })}
    </div>
  );
}
