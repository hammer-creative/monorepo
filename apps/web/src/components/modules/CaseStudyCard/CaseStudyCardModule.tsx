// apps/web/src/components/modules/CaseStudyCard/CaseStudyCardModule.tsx
'use client';

import {
  ClientNames,
  SanityImageHomePageCard,
  Title,
} from '@/components/common';
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll';
import type { CaseStudyTeaserItem } from '@/types/caseStudy';
import type { CaseStudyCardModule as CaseStudyCardModuleType } from '@/types/sanity.generated';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  caseStudyAnimations,
  generateCaseStudyAnimations,
} from './caseStudy.animations';

function CaseStudyCardItem({ item }: { item: CaseStudyTeaserItem }) {
  const { slug, title, clients, teaserImage } = item;

  const clientNames = (clients ?? [])
    .map((c) => c?.name)
    .filter((name): name is string => typeof name === 'string');

  if (!title && !teaserImage) return null;

  const hasClients = clientNames.length > 0;

  return (
    <div className="case-study-card">
      <Link href={`/work/${slug}`}>
        {teaserImage && (
          <div className="image">
            <SanityImageHomePageCard image={teaserImage} />
          </div>
        )}
        <div className="meta">
          {hasClients && (
            <div className="clients">
              <ClientNames clientNames={clientNames} />
            </div>
          )}
          {title && (
            <Title as="h3" variant="tertiary">
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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 640);
  }, []);

  if (!isValidCaseStudyCardModule(data)) return null;

  const { caseStudies } = data;

  const validCaseStudies = caseStudies.filter(
    (cs) => !('_ref' in cs),
  ) as CaseStudyTeaserItem[];

  if (isDesktop) {
    const animationConfiguration = generateCaseStudyAnimations(
      validCaseStudies.length,
    );
    return (
      <AnimateOnScroll config={animationConfiguration}>
        <div className="case-study-grid">
          {validCaseStudies.map((caseStudy) => (
            <CaseStudyCardItem key={caseStudy._id} item={caseStudy} />
          ))}
        </div>
      </AnimateOnScroll>
    );
  }

  return (
    <div className="case-study-grid">
      {validCaseStudies.map((caseStudy) => (
        <AnimateOnScroll key={caseStudy._id} config={caseStudyAnimations.card}>
          <CaseStudyCardItem item={caseStudy} />
        </AnimateOnScroll>
      ))}
    </div>
  );
}
