// apps/web/src/app/work/[slug]/page.tsx
import {
  CarouselModule,
  HeroModule,
  ImpactModule,
  SingleImageModule,
  TextImageModule,
  TextModule,
  VideoModule,
} from '@/components/modules';
import {
  client,
  getCaseStudy,
  getCaseStudySlugs,
  resolveModuleColors,
} from '@/lib/sanity';
import type {
  CarouselModule as CarouselModuleType,
  HeroModule as HeroModuleType,
  ImpactModule as ImpactModuleType,
  SingleImageModule as SingleImageModuleType,
  TextImageModule as TextImageModuleType,
  TextModule as TextModuleType,
  VideoModule as VideoModuleType,
} from '@/types/sanity.generated';
import { toKebab } from '@/utils/stringUtils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Union type for all possible module data types
type ModuleData =
  | HeroModuleType
  | VideoModuleType
  | SingleImageModuleType
  | TextModuleType
  | TextImageModuleType
  | ImpactModuleType
  | CarouselModuleType;

// Map module type names to their React components
const moduleComponents = {
  heroModule: HeroModule,
  videoModule: VideoModule,
  singleImageModule: SingleImageModule,
  textModule: TextModule,
  textImageModule: TextImageModule,
  impactModule: ImpactModule,
  carouselModule: CarouselModule,
};

// Next.js config: allow dynamic params for slugs not in generateStaticParams
export const dynamicParams = true;
// Revalidate every 60 seconds for ISR
export const revalidate = 30;
// Force static generation at build time
export const dynamic = 'force-static';

// Generate static paths for all case study slugs at build time
export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((item: { slug?: string }) => ({
    slug: String(item.slug),
  }));
}

// Generate metadata for SEO and Open Graph
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const caseStudy = await getCaseStudy(slug, client);

  if (!caseStudy) return {};

  const { title = 'Case Study' } = caseStudy;

  return {
    title,
    openGraph: {
      title,
      type: 'article',
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug, client);

  // Return 404 if case study not found
  if (!caseStudy) notFound();

  // Use empty array if no clients (allows incomplete drafts)
  const { clients = [] } = caseStudy;

  // Resolve color references to actual hex values
  const resolvedModules = caseStudy.modules?.map(resolveModuleColors) || [];

  // Filter out service/deliverable modules and convert null values to undefined
  // (React doesn't render undefined but throws warnings on null)
  const filteredModules = resolvedModules
    .filter(
      (m: { _type: string }) =>
        m._type !== 'servicesModule' && m._type !== 'deliverablesModule',
    )
    .map((mod) => {
      return JSON.parse(
        JSON.stringify(mod, (_key, value) =>
          value === null ? undefined : value,
        ),
      );
    });

  return (
    <article className="case-study">
      {filteredModules.map(
        (
          mod: {
            _key: string;
            _type: string;
            backgroundColor?: { hex?: string };
            textColor?: { hex?: string };
          },
          index: number,
        ) => {
          // Get the React component for this module type
          const Component =
            moduleComponents[mod._type as keyof typeof moduleComponents];

          // Skip if no component registered for this module type
          if (!Component) return null;

          const { _key, _type, backgroundColor, textColor } = mod;

          // Only hero and text modules receive client data
          const moduleClients =
            _type === 'heroModule' || _type === 'textModule' ? clients : [];

          // First non-hero module gets content-start ID
          const isFirstContentModule =
            index === 1 && filteredModules[0]._type === 'heroModule';

          return (
            <section
              key={_key}
              id={isFirstContentModule ? 'content-start' : undefined}
              className={`module ${toKebab(_type)}`}
              style={
                {
                  // CSS custom properties for module colors
                  '--module-bg': backgroundColor?.hex,
                  '--module-text': textColor?.hex,
                } as React.CSSProperties
              }
            >
              {/* @ts-expect-error - Dynamic module rendering with union types */}
              <Component data={mod as ModuleData} clients={moduleClients} />
            </section>
          );
        },
      )}
    </article>
  );
}
