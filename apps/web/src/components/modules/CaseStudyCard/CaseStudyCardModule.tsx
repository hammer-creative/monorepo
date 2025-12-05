// apps/web/src/components/modules/CaseStudyCard/CaseStudyCardModule.tsx
import { ClientNames, Title, SanityImage } from '@/components/common';
import type { CaseStudyCardModuleType } from '@/types/sanity';
import Link from 'next/link';

type CaseStudyItemType = NonNullable<
  CaseStudyCardModuleType['caseStudies']
>[number];

function CaseStudyCardItem({ item }: { item: CaseStudyItemType }) {
  if (!item) return null;

  const { slug, title, modules } = item;
  const hero = Array.isArray(modules) ? modules[0] : modules;
  const { clients = [], teaserImage } = hero;
  const clientNames = clients
    .map((client: any) => client?.name)
    .filter(Boolean);

  return (
    <article className="card">
      <Link href={`/work/${slug}`}>
        {clientNames.length > 0 && (
          <div className="case-study-clients">
            <ClientNames clientNames={clientNames} />
          </div>
        )}
        {title && <Title title={title} className="case-study-title" as="h3" />}
        {teaserImage && (
          <SanityImage
            image={teaserImage}
            width={1200}
            height={800}
            className="hero-image"
            priority
          />
        )}
      </Link>
    </article>
  );
}

export function CaseStudyCardModule({
  data,
}: {
  data: CaseStudyCardModuleType | null;
}) {
  if (!data?.caseStudies?.length) return null;

  return (
    <>
      {data.caseStudies.map((caseStudy) => (
        <CaseStudyCardItem key={caseStudy._id} item={caseStudy} />
      ))}
    </>
  );
}
