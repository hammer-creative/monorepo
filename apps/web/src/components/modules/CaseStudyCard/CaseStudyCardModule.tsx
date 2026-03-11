// apps/web/src/components/modules/CaseStudyCard/CaseStudyCardModule.tsx
'use client';

import { ClientList, SanityImageTeaser, Title } from '@/components/common';
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll';
import type { CaseStudyTeaserItem } from '@/types/caseStudy';
import type { CaseStudyCardModule as CaseStudyCardModuleType } from '@/types/sanity.generated';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  caseStudyAnimations,
  generateCaseStudyAnimations,
} from './caseStudy.animations';

const bem = 'case-study';

/**
 * Renders a single case study card with image, client names, and title.
 * Returns null if both title and image are absent.
 */
function CaseStudyCardItem({ item }: { item: CaseStudyTeaserItem }) {
  const { slug, title, clients, teaserImage } = item;

  if (!title && !teaserImage) return null;

  console.log(item);

  return (
    <div className={`${bem}__card`}>
      <Link href={`/work/${slug}`}>
        {teaserImage && (
          <SanityImageTeaser image={teaserImage} className={`${bem}__image`} />
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

/**
 * Type guard ensuring `data` is a valid `CaseStudyCardModule` with at least
 * one resolved case study.
 */
function isValidCaseStudyCardModule(
  data: CaseStudyCardModuleType | null,
): data is CaseStudyCardModuleType & { caseStudies: CaseStudyTeaserItem[] } {
  return (
    data !== null &&
    Array.isArray(data.caseStudies) &&
    data.caseStudies.length > 0
  );
}

/**
 * Renders a grid of case study cards from a Sanity `CaseStudyCardModule`.
 * On desktop, all cards animate together via a generated stagger config.
 * On mobile, each card animates independently.
 */
export function CaseStudyCardModule({
  data,
}: {
  œdata: CaseStudyCardModuleType | null;
}) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 640);
  }, []);

  if (!isValidCaseStudyCardModule(data)) return null;

  const validCaseStudies = data.caseStudies.filter(
    (cs) => !('_ref' in cs),
  ) as CaseStudyTeaserItem[];

  if (isDesktop) {
    return (
      <AnimateOnScroll
        config={generateCaseStudyAnimations(validCaseStudies.length)}
      >
        <div className={`${bem}__grid`}>
          {validCaseStudies.map((caseStudy) => (
            <CaseStudyCardItem key={caseStudy._id} item={caseStudy} />
          ))}
        </div>
      </AnimateOnScroll>
    );
  }

  return (
    <div className={`${bem}__grid`}>
      {validCaseStudies.map((caseStudy) => (
        <AnimateOnScroll key={caseStudy._id} config={caseStudyAnimations.card}>
          <CaseStudyCardItem item={caseStudy} />
        </AnimateOnScroll>
      ))}
    </div>
  );
}
