// apps/web/src/lib/sanity/index.ts
import { projections, moduleProjections } from '@/lib/sanity/groq';
import { fetchOne, fetchAll, fetchSlugs } from '@/lib/sanity/groq/helpers';
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

export async function getAllCaseStudies(
  sanityClient?: SanityClient,
): Promise<CaseStudy[]> {
  return fetchAll<CaseStudy>(
    'caseStudy',
    caseStudyProjection,
    '| order(_createdAt desc)',
    sanityClient,
  );
}

export async function getCaseStudySlugs(): Promise<{ slug: string }[]> {
  return fetchSlugs('caseStudy');
}
