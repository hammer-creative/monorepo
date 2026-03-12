// apps/web/src/components/modules/CaseStudyCard/CaseStudyCardModule.tsx
'use client';

import { ClientList, SanityImageTeaser, Title } from '@/components/common';
import type { CaseStudyTeaserItem } from '@/types/caseStudy';
import type { CaseStudyCardModule as CaseStudyCardModuleType } from '@/types/sanity.generated';
import Link from 'next/link';

const bem = 'case-study';

function CaseStudyCardItem({
  item,
  index,
}: {
  item: CaseStudyTeaserItem;
  index: number;
}) {
  const { slug, title, clients, teaserImage } = item;

  if (!title && !teaserImage) return null;

  return (
    <div className={`${bem}__card`}>
      <Link href={`/work/${slug}`}>
        {teaserImage && (
          <SanityImageTeaser
            image={teaserImage}
            className={`${bem}__image`}
            priority={index < 4}
          />
        )}
        <div className={`${bem}__details`}>
          <ClientList clients={clients!} />
          {title && (
            <Title as="h3" className={`${bem}__title`}>
              {title}
            </Title>
          )}
        </div>
      </Link>
    </div>
  );
}

function isValidCaseStudyCardModule(
  data: CaseStudyCardModuleType | null,
): data is CaseStudyCardModuleType & { caseStudies: CaseStudyTeaserItem[] } {
  return (
    data !== null &&
    Array.isArray(data.caseStudies) &&
    data.caseStudies.length > 0
  );
}

export function CaseStudyCardModule({
  data,
}: {
  data: CaseStudyCardModuleType | null;
}) {
  if (!isValidCaseStudyCardModule(data)) return null;

  const validCaseStudies = data.caseStudies.filter(
    (cs) => !('_ref' in cs),
  ) as CaseStudyTeaserItem[];

  return (
    <div className={`${bem}__grid`}>
      {validCaseStudies.map((caseStudy, index) => (
        <CaseStudyCardItem key={caseStudy._id} item={caseStudy} index={index} />
      ))}
    </div>
  );
}
