import { Masthead } from '@/components/common/Masthead';
import Scene from '@/components/common/Scene';
import { CaseStudyCardModule, TextModule } from '@/components/modules';
import {
  client,
  draftClient,
  getHomePage,
  resolveModuleColors,
} from '@/lib/sanity';
import type { HomePage as HomePageType } from '@/types/sanity.generated';
import { toKebab } from '@/utils/stringUtils';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';

interface HomePageData {
  homePage: HomePageType | null;
}

const moduleComponents = {
  caseStudyCardModule: CaseStudyCardModule,
  textModule: TextModule,
} as const;

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
  return { homePage };
}

export default async function HomePage() {
  const { homePage } = await getHomePageData();

  if (!homePage) return null;

  const resolvedModules = homePage.modules?.map(resolveModuleColors) || [];

  return (
    <div className="container">
      <div className="marquee">
        <Masthead />
        <Scene />
      </div>
      {resolvedModules.map(
        (
          mod: {
            _key: string;
            _type: string;
            backgroundColor?: { hex?: string };
            textColor?: { hex?: string };
          },
          index,
        ) => {
          const Component =
            moduleComponents[mod._type as keyof typeof moduleComponents];

          if (!Component) {
            console.warn(`No component found for module type "${mod._type}"`);
            return null;
          }

          const moduleClass = `module ${toKebab(mod._type)}`;
          const { backgroundColor, textColor } = mod;

          return (
            <section
              key={mod._key}
              className={moduleClass}
              data-module-index={index}
              style={
                {
                  '--module-bg': backgroundColor?.hex,
                  '--module-text': textColor?.hex,
                } as React.CSSProperties
              }
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Component data={mod as any} />{' '}
            </section>
          );
        },
      )}
    </div>
  );
}
