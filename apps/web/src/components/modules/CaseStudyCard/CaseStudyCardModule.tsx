// apps/web/src/components/modules/CaseStudyCard/CaseStudyCardModule.tsx
import { Title, TextBlock, SanityImage } from '@/components/common';
import type { CaseStudyCardModuleType } from '@/types/sanity';
import Link from 'next/link';

type CaseStudyItemType = NonNullable<
  CaseStudyCardModuleType['caseStudies']
>[number];

function CaseStudyCardItem({ item }: { item: CaseStudyItemType }) {
  const {
    slug,
    title,
    modules: {
      client: { name },
      image,
    },
  } = item;

  // console.log(name);

  return (
    <article className="case-study-card">
      <Link href={`/case-studies/${slug}`}>
        {image && (
          <SanityImage
            image={image}
            width={800}
            height={600}
            className="card-image"
          />
        )}
        <Title title={title} />
        {name}
        <div className="text medium">{name}</div>
      </Link>
    </article>
  );
}

export function CaseStudyCardModule({
  data,
}: {
  data: CaseStudyCardModuleType;
}) {
  const { caseStudies } = data;

  if (!caseStudies?.length) return null;

  return (
    <div className="case-study-card-module">
      {caseStudies.map((caseStudy) => (
        <CaseStudyCardItem key={caseStudy._id} item={caseStudy} />
      ))}
    </div>
  );
}
