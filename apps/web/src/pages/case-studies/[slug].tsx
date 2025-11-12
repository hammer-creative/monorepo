// apps/web/src/pages/case-studies/[slug].tsx
import {
  HeroModule,
  VideoModule,
  TextModule,
  TextImageModule,
  // ImpactModule,
} from '@/components/modules';
import { getCaseStudy, getCaseStudySlugs } from '@/lib/sanity';
import { resolveModuleColors } from '@/lib/sanity/colors';
import { ModuleType } from '@/types/sanity';
import type {
  CaseStudy,
  Module,
  HeroModuleType,
  // ImpactModuleType,
  TextModuleType,
  TextImageModuleType,
  VideoModuleType,
} from '@/types/sanity';
import { toKebab } from '@/utils/stringUtils';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import type { ComponentType } from 'react';

interface Props {
  caseStudy: CaseStudy;
}

/**
 * Map of known module types to their React components.
 * Used for type-safe module rendering.
 */
type KnownModules = {
  [ModuleType.Hero]: ComponentType<{ data: HeroModuleType }>;
  // [ModuleType.Impact]: ComponentType<{ data: ImpactModuleType }>;
  [ModuleType.Text]: ComponentType<{ data: TextModuleType }>;
  [ModuleType.TextImage]: ComponentType<{ data: TextImageModuleType }>;
  [ModuleType.Video]: ComponentType<{ data: VideoModuleType }>;
};

/**
 * Registry mapping module type strings to their corresponding React components.
 * Each module type from Sanity gets rendered by its specific component.
 */
const knownModuleComponents: KnownModules = {
  [ModuleType.Hero]: HeroModule,
  [ModuleType.Video]: VideoModule,
  [ModuleType.Text]: TextModule,
  [ModuleType.TextImage]: TextImageModule,
  // [ModuleType.Impact]: ImpactModule,
};

/**
 * Runtime module component lookup.
 * Allows for graceful handling of unknown module types.
 */
const moduleComponents: Record<
  string,
  ComponentType<any>
> = knownModuleComponents;

/**
 * Case Study Detail Page
 *
 * Renders a complete case study with all its modules.
 * Each module type is rendered with its specific component and colors are
 * resolved from Sanity's color references to actual hex values.
 *
 * Color values are passed down via CSS custom properties (--module-background, --module-text)
 * so child components can inherit them without prop drilling.
 *
 * @param caseStudy - The case study data fetched from Sanity
 */
export default function CaseStudyPage({ caseStudy }: Props) {
  /**
   * Transform Sanity color references into resolved hex values.
   * Maps over all modules and converts color objects like { enabled: true, name: 'nightshade' }
   * into { enabled: true, name: 'nightshade', hex: '#141515' }
   */
  const resolvedModules = caseStudy.modules.map(resolveModuleColors);

  return (
    <>
      <NextSeo
        title={caseStudy.title}
        titleTemplate="%s | Hammer Creative"
        openGraph={{ title: caseStudy.title, type: 'article' }}
      />
      <article className="case-study">
        {resolvedModules.map((mod, index) => {
          // Look up the component for this module type
          const Component = moduleComponents[mod._type];

          /**
           * Skip rendering if no component is registered for this module type.
           * This prevents crashes from unknown or newly added module types.
           * TODO: Wire up error reporting service here (Sentry, etc.)
           */
          if (!Component) {
            console.warn(`No component found for module type "${mod._type}"`);
            return null;
          }

          // Generate CSS class name from module type (e.g., 'heroModule' -> 'hero-module')
          const moduleClass = `module ${toKebab(mod._type)}`;

          /**
           * Extract hex color values with null-safe fallbacks.
           * backgroundColor exists on all modules, textColor only on modules with text content.
           */
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
                  /**
                   * CSS custom properties allow child components to access colors
                   * without explicit prop passing. The properties cascade down the DOM tree.
                   *
                   * --module-background: Used for section backgrounds and any nested backgrounds
                   * --module-text: Inherited by all text elements within the module
                   */
                  '--module-bg': backgroundHex,
                  '--module-text': textHex,
                  backgroundColor: 'var(--module-bg)',
                  color: 'var(--module-text)',
                } as React.CSSProperties
              }
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

/**
 * Generate static paths for all published case studies.
 * Enables static generation at build time for better performance.
 *
 * @returns Array of paths with case study slugs
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getCaseStudySlugs();
  return {
    paths: slugs.map((item) => ({
      params: {
        slug: item.slug,
      },
    })),
    fallback: 'blocking', // Generate missing pages on-demand
  };
};

/**
 * Fetch case study data at build time (or on-demand with fallback: 'blocking').
 *
 * @param params - Route parameters containing the case study slug
 * @returns Props for the page component or notFound
 */
export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;

  // Return 404 if no slug provided
  if (!slug) return { notFound: true };

  // Fetch case study from Sanity
  const caseStudy = await getCaseStudy(slug);

  // Return 404 if case study doesn't exist
  if (!caseStudy) return { notFound: true };

  return {
    props: { caseStudy },
    revalidate: 60, // Regenerate page every 60 seconds (ISR)
  };
};
