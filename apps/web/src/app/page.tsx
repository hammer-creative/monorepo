// apps/web/src/app/page.tsx

import {
  ClientIcons,
  ExtendedLink,
  LinkArrowSmall,
  Text,
} from '@/components/common';
import { Impressum } from '@/components/common/Impressum';
import { WordmarkSVG } from '@/components/common/Wordmark';
import { MarqueeScene } from '@/components/marquee/MarqueeScene';
import { CaseStudyCardModule, TextModule } from '@/components/modules';
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll';
import { buildMetadata } from '@/config/metadata';
import { client, getHomePage, resolveModuleColors } from '@/lib/sanity';
import type {
  CaseStudyCardModule as CaseStudyCardModuleType,
  HomePage as HomePageType,
  TextModule as TextModuleType,
} from '@/types/sanity.generated';
import { toKebab } from '@/utils/stringUtils';
import type { ReactElement } from 'react';

import { homePageAnimations } from './page.animations';

const bem = 'home';

const moduleComponents = {
  caseStudyCardModule: CaseStudyCardModule,
  textModule: TextModule,
} as const;

type ModuleData = CaseStudyCardModuleType | TextModuleType;

interface InjectedContent {
  moduleIndex: number;
  position: 'before' | 'after';
  content: ReactElement | ReactElement[];
}

const INJECTED_CONTENT: InjectedContent[] = [
  {
    moduleIndex: 1,
    position: 'after',
    content: [
      <ExtendedLink
        key="link-1"
        href="/services"
        className="label"
        arrowComponent={<LinkArrowSmall />}
      >
        View Our Services
      </ExtendedLink>,
    ],
  },
  {
    moduleIndex: 2,
    position: 'before',
    content: [<Text key="heading-3" as="h2" text="Our Work" />],
  },
  {
    moduleIndex: 2,
    position: 'after',
    content: [
      <ExtendedLink
        key="link-2"
        href="/work"
        className="label"
        arrowComponent={<LinkArrowSmall />}
      >
        View All Work
      </ExtendedLink>,
    ],
  },
];

export const metadata = buildMetadata('Home');

export const revalidate = 60;

async function getHomePageData(): Promise<{ homePage: HomePageType | null }> {
  const homePage = await getHomePage(client);
  return { homePage };
}

function getAnimateConfig(type: string, index: number) {
  if (type === 'textModule' && index === 0)
    return homePageAnimations.textModuleFirst;
  if (type === 'textModule' && index === 1)
    return homePageAnimations.textModuleSecond;
  return null;
}

export default async function HomePage() {
  const { homePage } = await getHomePageData();
  if (!homePage) return null;

  const resolvedModules = homePage.modules?.map(resolveModuleColors) ?? [];

  return (
    <>
      <div className={`${bem}__marquee`}>
        <div className={`${bem}__masthead`}>
          <div className={`${bem}__wordmark`}>
            <WordmarkSVG />
            <Text as="div" variant="tagline" text="The Gaming Agency" />
          </div>
          <Impressum />
        </div>
        <div className={`${bem}__scene`}>
          <MarqueeScene />
        </div>
      </div>
      <div className={`${bem}__modules`}>
        {resolvedModules.flatMap((mod, index) => {
          const Component =
            moduleComponents[mod._type as keyof typeof moduleComponents];
          if (!Component) {
            console.warn(`No component found for module type "${mod._type}"`);
            return [];
          }

          const injectedBefore = INJECTED_CONTENT.filter(
            (item) => item.moduleIndex === index && item.position === 'before',
          );
          const injectedAfter = INJECTED_CONTENT.filter(
            (item) => item.moduleIndex === index && item.position === 'after',
          );

          const animateConfig = getAnimateConfig(mod._type, index);

          const content = (
            <>
              {injectedBefore.flatMap((item) =>
                Array.isArray(item.content) ? item.content : [item.content],
              )}
              {/* @ts-expect-error - Dynamic module rendering */}
              <Component data={mod as ModuleData} />
              {injectedAfter.flatMap((item) =>
                Array.isArray(item.content) ? item.content : [item.content],
              )}
            </>
          );

          const section = (
            <section
              key={mod._key}
              className={`module ${toKebab(mod._type)}`}
              data-module-index={index}
              style={
                {
                  '--module-bg': mod.backgroundColor?.hex,
                  '--module-text': mod.textColor?.hex,
                } as React.CSSProperties
              }
            >
              {animateConfig ? (
                <AnimateOnScroll config={animateConfig}>
                  {content}
                </AnimateOnScroll>
              ) : (
                content
              )}
            </section>
          );

          const sections = [section];

          if (index === resolvedModules.length - 2) {
            sections.push(
              <section
                key="client-icons"
                className="module client-icons-module"
              >
                <ClientIcons chyron />
              </section>,
            );
          }

          return sections;
        })}
      </div>
    </>
  );
}
