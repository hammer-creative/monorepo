// apps/web/src/lib/queries/caseStudy.ts
import { projections, moduleProjections } from '@/lib/sanity/groq/builders';
import type { CaseStudy, CaseStudyListItem } from '@/types/sanity';
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

export async function getCaseStudySlugs() {
  return fetchSlugs('caseStudy');
}

export async function getCaseStudy(slug: string) {
  return fetchOne<CaseStudy>('caseStudy', slug, fullProjection);
}

export async function getAllCaseStudies() {
  return fetchAll<CaseStudyListItem>('caseStudy', listProjection);
}
