// queries/caseStudy.ts
import {
  caseStudyProjection,
  caseStudyTeaserProjection,
} from '@/lib/sanity/groq';
import { fetchAll, fetchOne, fetchSlugs } from '@/lib/sanity/groq/helpers';
import type { CaseStudyTeaserItem } from '@/types/caseStudy';
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

export async function getAllCaseStudyTeasers(
  sanityClient?: SanityClient,
): Promise<CaseStudyTeaserItem[]> {
  return fetchAll<CaseStudyTeaserItem>(
    'caseStudy',
    caseStudyTeaserProjection,
    '| order(_createdAt desc)',
    sanityClient,
  );
}

export async function getCaseStudySlugs(): Promise<{ slug: string }[]> {
  return fetchSlugs('caseStudy');
}
