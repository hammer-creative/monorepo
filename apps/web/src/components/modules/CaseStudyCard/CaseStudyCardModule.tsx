// apps/web/src/components/modules/CaseStudyCard/CaseStudyCardModule.tsx
import { ClientNames, Title, SanityHomePageCard } from '@/components/common';
import type { CaseStudyCardModuleType } from '@/types/sanity';
import Link from 'next/link';

type CaseStudyItemType = NonNullable<
  CaseStudyCardModuleType['caseStudies']
>[number];

function CaseStudyCardItem({ item }: { item: CaseStudyItemType }) {
  if (!item) return null;

  const { slug = null, title = null, modules = null } = item;

  if (!slug) return null;

  const hero = Array.isArray(modules) ? modules[0] : modules;
  if (!hero) return null;

  const { clients = [], teaserImage = null } = hero;

  const clientNames = clients
    .map((client: any) => client?.name ?? null)
    .filter(Boolean) as string[];

  if (!title && !teaserImage && !clientNames.length) return null;

  return (
    <div className="case-study-card">
      <Link href={`/work/${slug}`}>
        {/* Image */}
        {teaserImage && (
          <div className="image">
            <SanityHomePageCard
              image={teaserImage}
              sizes="(max-width: 800px) 100vw, 690px"
              width={690}
              height={400}
            />
          </div>
        )}

        <div className="meta">
          {/* Clients */}
          {clientNames.length > 0 && (
            <div className="case-study-clients">
              <ClientNames clientNames={clientNames} />
            </div>
          )}

          {/* Title */}
          {title && (
            <Title title={title} className="case-study-title" as="h3" />
          )}
        </div>
      </Link>
    </div>
  );
}

export function CaseStudyCardModule({
  data,
}: {
  data: CaseStudyCardModuleType | null;
}) {
  if (!data) return null;

  const { caseStudies = [] } = data;
  if (!caseStudies.length) return null;

  console.log(caseStudies);

  return (
    <div className="case-study-cards">
      {caseStudies.map((caseStudy) => (
        <>
          <CaseStudyCardItem key={caseStudy._id} item={caseStudy} />
        </>
      ))}
    </div>
  );
}
