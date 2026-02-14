// apps/web/src/components/modules/CaseStudyCard/CaseStudyCardModule.tsx
'use client';

import {
  ClientNames,
  SanityImageHomePageCard,
  Title,
} from '@/components/common';
import type { SanityImageType } from '@/components/common/SanityImage';
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll';
import type { CaseStudyCardModule as CaseStudyCardModuleType } from '@/types/sanity.generated';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  caseStudyAnimations,
  generateCaseStudyAnimations,
} from './caseStudy.animations';

// The generated types show caseStudies as references, but GROQ expands them
// This type represents what we actually get at runtime after GROQ expansion
type ExpandedCaseStudy = {
  _id: string;
  slug?: string;
  title?: string;
  clients?: Array<{ _id: string; name?: string }>;
  modules?: Array<{
    teaserImage?: SanityImageType;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

// Type guard: Check if case study item has required data
function isValidCaseStudy(item: unknown): item is ExpandedCaseStudy {
  if (!item || typeof item !== 'object') return false;
  const study = item as ExpandedCaseStudy;
  return Boolean(study._id && study.slug);
}

function CaseStudyCardItem({ item }: { item: unknown }) {
  // Guard: Early return if invalid case study
  if (!isValidCaseStudy(item)) return null;

  const { slug, title = null, clients = [], modules = [] } = item;

  // Get hero module (first module in array)
  const hero = Array.isArray(modules) && modules.length > 0 ? modules[0] : null;
  const teaserImage = hero?.teaserImage ?? null;

  // Extract client names
  const clientNames = Array.isArray(clients)
    ? clients
        .map((c) => c?.name)
        .filter((name): name is string => typeof name === 'string')
    : [];

  // Guard: Need at least title or image to render
  if (!title && !teaserImage) return null;

  const hasClients = clientNames.length > 0;

  return (
    <div className="case-study-card">
      <Link href={`/work/${slug}`}>
        {/* Teaser Image */}
        {teaserImage && (
          <div className="image">
            <SanityImageHomePageCard image={teaserImage} />
          </div>
        )}

        {/* Title + Clients */}
        <div className="meta">
          {hasClients && (
            <div className="clients">
              <ClientNames clientNames={clientNames} />
            </div>
          )}
          {title && (
            <Title className="case-study-title" as="h3" variant="tertiary">
              {title}
            </Title>
          )}
        </div>
      </Link>
    </div>
  );
}

// Type guard: Check if module data exists and is valid
function isValidCaseStudyCardModule(
  data: CaseStudyCardModuleType | null,
): data is CaseStudyCardModuleType & { caseStudies: unknown[] } {
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
  // Hooks MUST come first, before any returns
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 640);
  }, []);

  // Guards come after hooks
  if (!isValidCaseStudyCardModule(data)) return null;

  const { caseStudies } = data;
  // apps/web/src/components/modules/CaseStudyCard/CaseStudyCardModule.tsx

  const validCaseStudies = caseStudies.filter(
    (cs) => !('_ref' in cs) && isValidCaseStudy(cs),
  ) as ExpandedCaseStudy[];

  // Desktop: wrap all cards in single AnimateOnScroll, chain them sequentially
  if (isDesktop) {
    const animationConfiguration = generateCaseStudyAnimations(
      validCaseStudies.length,
    );
    return (
      <AnimateOnScroll config={animationConfiguration}>
        <div className="case-study-cards">
          {validCaseStudies.map((caseStudy) => (
            <CaseStudyCardItem key={caseStudy._id} item={caseStudy} />
          ))}
        </div>
      </AnimateOnScroll>
    );
  }

  // Mobile: each card animates independently on scroll-into-view
  return (
    <div className="case-study-cards">
      {validCaseStudies.map((caseStudy) => (
        <AnimateOnScroll key={caseStudy._id} config={caseStudyAnimations.card}>
          <CaseStudyCardItem item={caseStudy} />
        </AnimateOnScroll>
      ))}
    </div>
  );
}
