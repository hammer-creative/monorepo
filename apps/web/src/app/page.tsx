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
import { draftMode } from 'next/headers';

import { homePageAnimations } from './page.animations';

const bem = 'home';

const moduleComponents = {
  caseStudyCardModule: CaseStudyCardModule,
  textModule: TextModule,
} as const;

type ModuleData = CaseStudyCardModuleType | TextModuleType;

/**
 * Describes a link injected after a specific module index in the home page
 * module list, rendered as an `ExtendedLink` with an arrow.
 */
interface InjectedLink {
  moduleIndex: number;
  href: string;
  label: string;
  className?: string;
}

/**
 * Links injected after specific modules by index. Decoupled from CMS data so
 * editorial changes to module order require updating these indices.
 */
const INJECTED_LINKS: InjectedLink[] = [
  {
    moduleIndex: 1,
    href: '/services',
    label: 'View Our Services',
    className: 'label',
  },
  { moduleIndex: 3, href: '/work', label: 'View All Work', className: 'label' },
];

export const metadata = buildMetadata('Home');

export const revalidate = 60;

/**
 * Fetches home page data from Sanity, switching to the draft client when Next
 * draft mode is active.
 */
async function getHomePageData(): Promise<{ homePage: HomePageType | null }> {
  const draft = await draftMode();
  const sanityClient = draft.isEnabled ? draftClient : client;
  const homePage = await getHomePage(sanityClient);
  return { homePage };
}

/**
 * Returns the scroll animation config for a given module type and position, or
 * `null` if the module should render without animation.
 */
function getAnimateConfig(type: string, index: number) {
  if (type === 'textModule' && index === 0)
    return homePageAnimations.textModuleFirst;
  if (type === 'textModule' && index === 1)
    return homePageAnimations.textModuleSecond;
  return null;
}

/**
 * Renders the home page. Modules are fetched from Sanity and rendered
 * dynamically via `moduleComponents`. A `ClientIcons` chyron is injected
 * before the final module, and `INJECTED_LINKS` are appended after their
 * respective modules by index.
 */
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

          const links = INJECTED_LINKS.filter((l) => l.moduleIndex === index);
          const animateConfig = getAnimateConfig(mod._type, index);

          const content = (
            <>
              {/* @ts-expect-error - Dynamic module rendering */}
              <Component data={mod as ModuleData} />
              {links.map((link, i) => (
                <ExtendedLink
                  key={i}
                  href={link.href}
                  className={link.className}
                  arrowComponent={<LinkArrowSmall />}
                >
                  {link.label}
                </ExtendedLink>
              ))}
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
