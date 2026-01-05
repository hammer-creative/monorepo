// apps/web/src/components/modules/CaseStudyCard/CaseStudyCardModule.tsx
import {
  ClientNames,
  SanityHomePageCardImage,
  Title,
} from '@/components/common';
import type { CaseStudyCardModule as CaseStudyCardModuleType } from '@/types/sanity.generated';
import Link from 'next/link';

// The generated types show caseStudies as references, but GROQ expands them
// This type represents what we actually get at runtime after GROQ expansion
type ExpandedCaseStudy = {
  _id: string;
  slug?: string;
  title?: string;
  clients?: any[];
  modules?: Array<{
    teaserImage?: any;
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
    ? clients.map((c: any) => c?.name).filter(Boolean)
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
            <SanityHomePageCardImage image={teaserImage} />
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
            <Title title={title} className="case-study-title" as="h3" />
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
  // Guard: Early return if no valid data or empty case studies
  if (!isValidCaseStudyCardModule(data)) return null;

  const { caseStudies } = data;

  return (
    <div className="case-study-cards">
      {caseStudies.map((caseStudy: unknown) => (
        <CaseStudyCardItem
          key={isValidCaseStudy(caseStudy) ? caseStudy._id : Math.random()}
          item={caseStudy}
        />
      ))}
    </div>
  );
}
