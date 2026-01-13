// apps/web/src/app/work/[slug]/page.tsx
import {
  CarouselModule,
  HeroModule,
  ImpactModule,
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
import { toKebab } from '@/utils/stringUtils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const moduleComponents = {
  heroModule: HeroModule,
  videoModule: VideoModule,
  textModule: TextModule,
  textImageModule: TextImageModule,
  impactModule: ImpactModule,
  carouselModule: CarouselModule,
};

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((item: { slug?: string }) => ({
    slug: String(item.slug),
  }));
}

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

  console.log(caseStudy);

  if (!caseStudy) notFound();

  const { clients = [] } = caseStudy;

  const resolvedModules = caseStudy.modules?.map(resolveModuleColors) || [];
  const filteredModules = resolvedModules.filter(
    (m: { _type: string }) =>
      m._type !== 'servicesModule' && m._type !== 'deliverablesModule',
  );

  return (
    <article className="case-study">
      {filteredModules.map(
        (mod: {
          _key: string;
          _type: string;
          backgroundColor?: { hex?: string };
          textColor?: { hex?: string };
        }) => {
          const Component =
            moduleComponents[mod._type as keyof typeof moduleComponents];

          if (!Component) return null;

          const { _key, _type, backgroundColor, textColor } = mod;

          return (
            <section
              key={_key}
              className={`module ${toKebab(_type)}`}
              style={
                {
                  '--module-bg': backgroundColor?.hex,
                  '--module-text': textColor?.hex,
                } as React.CSSProperties
              }
            >
              <Component
                data={mod as never}
                clients={
                  (_type === 'heroModule' || _type === 'textModule'
                    ? clients
                    : undefined) as never
                }
              />
            </section>
          );
        },
      )}
    </article>
  );
}
