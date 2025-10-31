// apps/web/src/pages/case-studies/index.tsx
import { getAllCaseStudies } from '@/lib/sanity';
import type { CaseStudyListItem } from '@/types/sanity';
import type { GetStaticProps } from 'next';
import Link from 'next/link';

type Props = {
  caseStudies: CaseStudyListItem[];
};

export default function CaseStudiesPage({ caseStudies }: Props) {
  return (
    <div>
      <h1>Case Studies</h1>
      <ul>
        {caseStudies.map((study) => (
          <li key={study._id}>
            <Link href={`/case-studies/${study.slug}`}>{study.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const caseStudies = await getAllCaseStudies();

  return {
    props: {
      caseStudies,
    },
    revalidate: 60, // ISR: revalidate every 60 seconds
  };
};
