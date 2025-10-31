// apps/web/src/pages/case-studies/[slug].tsx
import { getCaseStudy, getCaseStudySlugs } from '@/lib/sanity';
import type { CaseStudy } from '@/types/sanity';
import type { GetStaticPaths, GetStaticProps } from 'next';

type Props = {
  caseStudy: CaseStudy;
};

export default function CaseStudyPage({ caseStudy }: Props) {
  return (
    <article>
      <h1>{caseStudy.title}</h1>

      {caseStudy.modules.map((module) => {
        if (module._type === 'heroModule') {
          return (
            <div key={module._key}>
              <h2>{module.heading}</h2>
            </div>
          );
        }
        return null;
      })}
    </article>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getCaseStudySlugs();

  return {
    paths: slugs.map((item) => ({
      params: { slug: item.slug },
    })),
    fallback: 'blocking', // or false for strict SSG
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      caseStudy,
    },
    revalidate: 60,
  };
};
