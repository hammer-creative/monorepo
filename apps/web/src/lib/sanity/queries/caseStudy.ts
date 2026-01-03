// apps/web/src/lib/sanity/queries/caseStudy.ts
import { caseStudyProjection } from '@/lib/sanity/groq';
import { fetchOne, fetchAll, fetchSlugs } from '@/lib/sanity/groq/helpers';
import type { CaseStudy } from '@/types/sanity.generated';
import type { SanityClient } from 'next-sanity';

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
