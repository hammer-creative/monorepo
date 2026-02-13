// apps/web/src/app/page.tsx
import { ArrowUpRight, ClientIcons, ExtendedLink } from '@/components/common';
import Scene from '@/components/model/Scene';
import { CaseStudyCardModule, TextModule } from '@/components/modules';
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll';
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
import type { ReactNode } from 'react';

import { homePageAnimations } from './page.animations';

interface HomePageData {
  homePage: HomePageType | null;
}

const moduleComponents = {
  caseStudyCardModule: CaseStudyCardModule,
  textModule: TextModule,
} as const;

type ModuleData = CaseStudyCardModuleType | TextModuleType;

interface InjectedLink {
  moduleIndex: number;
  href: string;
  label: string;
  className?: string;
  arrowComponent?: ReactNode;
}

const injectedLinks: InjectedLink[] = [
  {
    moduleIndex: 1,
    href: '/services',
    label: 'View Our Services',
    className: 'label',
  },
  {
    moduleIndex: 3,
    href: '/work',
    label: 'View All Work',
    className: 'label',
  },
];

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
    <div className="layout-container">
      <div className="marquee">
        <Scene />
      </div>
      <div className="layout-wrapper">
        {resolvedModules.flatMap((mod, index) => {
          const Component =
            moduleComponents[mod._type as keyof typeof moduleComponents];

          if (!Component) {
            console.warn(`No component found for module type "${mod._type}"`);
            return [];
          }

          const moduleClass = `module ${toKebab(mod._type)}`;
          const { backgroundColor, textColor } = mod;

          let animateConfig;
          if (mod._type === 'textModule' && index === 0) {
            animateConfig = homePageAnimations.textModuleFirst;
          } else if (mod._type === 'textModule' && index === 1) {
            animateConfig = homePageAnimations.textModuleSecond;
          }

          const linksForThisModule = injectedLinks.filter(
            (link) => link.moduleIndex === index,
          );

          const sections = [
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
              {animateConfig ? (
                <AnimateOnScroll config={animateConfig}>
                  {/* @ts-expect-error - Dynamic module rendering */}
                  <Component data={mod as ModuleData} />
                  {linksForThisModule.map((link, linkIndex) => (
                    <ExtendedLink
                      key={`link-${index}-${linkIndex}`}
                      href={link.href}
                      className={link.className}
                      arrowComponent={<ArrowUpRight />}
                    >
                      {link.label}
                    </ExtendedLink>
                  ))}
                </AnimateOnScroll>
              ) : (
                <>
                  {/* @ts-expect-error - Dynamic module rendering */}
                  <Component data={mod as ModuleData} />
                  {linksForThisModule.map((link, linkIndex) => (
                    <ExtendedLink
                      key={`link-${index}-${linkIndex}`}
                      href={link.href}
                      className={link.className}
                      arrowComponent={<ArrowUpRight />}
                    >
                      {link.label}
                    </ExtendedLink>
                  ))}
                </>
              )}
            </section>,
          ];

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
    </div>
  );
}
