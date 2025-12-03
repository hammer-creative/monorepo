// apps/web/src/lib/sanity/index.ts
import { fetchOne, fetchSlugs } from '@/lib/sanity';
import { projections, moduleProjections } from '@/lib/sanity/groq';
import type { CaseStudy } from '@/types/sanity';
import type { SanityClient } from 'next-sanity';

const caseStudyProjection = `
  _id,
  title,
  ${projections.slug},
  modules[] {
    ${moduleProjections}
  }
`;

export async function getCaseStudy(
  slug: string,
  sanityClient?: SanityClient,
): Promise<CaseStudy | null> {
  return fetchOne<CaseStudy>(
    'caseStudy',
    slug,
    caseStudyProjection,
    sanityClient,
  );
}

export async function getCaseStudySlugs(): Promise<{ slug: string }[]> {
  return fetchSlugs('caseStudy');
}
