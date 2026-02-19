// apps/web/src/types/caseStudy.ts
import type { SanityImageType } from '@/components/common/SanityImage';
import type { CaseStudy } from '@/types/sanity.generated';

export type CaseStudyTeaserItem = Pick<CaseStudy, '_id' | '_type' | 'title'> & {
  slug?: string;
  clients?: Array<{ _id: string; name?: string }> | null;
  teaserImage?: SanityImageType;
};
