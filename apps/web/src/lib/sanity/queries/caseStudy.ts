// apps/web/src/lib/queries/caseStudy.ts
import type { CaseStudy, CaseStudyListItem } from '@/types/sanity';
import type { SanityClient } from 'next-sanity';
import { projections, moduleProjections } from '../groq/builders';
import { fetchOne, fetchAll, fetchSlugs } from '../groq/helpers';

const fullProjection = `
  _id,
  title,
  ${projections.slug},
  modules[]{
    ${moduleProjections}
  }
`;

const listProjection = `
  _id,
  title,
  ${projections.slug}
`;

export async function getCaseStudySlugs(sanityClient?: SanityClient) {
  return fetchSlugs('caseStudy', sanityClient);
}

export async function getCaseStudy(slug: string, sanityClient?: SanityClient) {
  return fetchOne<CaseStudy>('caseStudy', slug, fullProjection, sanityClient);
}

export async function getAllCaseStudies(sanityClient?: SanityClient) {
  return fetchAll<CaseStudyListItem>(
    'caseStudy',
    listProjection,
    '| order(_createdAt desc)',
    sanityClient,
  );
}
