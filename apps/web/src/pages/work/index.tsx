// apps/web/src/lib/sanity/index.ts
import { fetchOne, fetchAll, fetchSlugs } from '@/lib/sanity';
import { projections, moduleProjections } from '@/lib/sanity/groq';
import type { CaseStudy } from '@/types/sanity';

const caseStudyProjection = `
  _id,
  title,
  ${projections.slug},
  modules[] {
    ${moduleProjections}
  }
`;

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  return fetchOne<CaseStudy>('caseStudy', slug, caseStudyProjection);
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  return fetchAll<CaseStudy>('caseStudy', caseStudyProjection);
}

export async function getCaseStudySlugs(): Promise<{ slug: string }[]> {
  return fetchSlugs('caseStudy');
}
