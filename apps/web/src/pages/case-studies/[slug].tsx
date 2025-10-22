import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import type { GetStaticProps, GetStaticPaths } from 'next';
import { fetchEntries } from '@chorusworks/contentful';

type CaseStudy = {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
  };
};

type PageProps = {
  caseStudy: CaseStudy;
};

export default function CaseStudyPage({ caseStudy }: PageProps) {
  const { fields } = useContentfulLiveUpdates(caseStudy);

  return (
    <div>
      <h1>{fields.title}</h1>
      <p>Slug: {fields.slug}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const caseStudies = await fetchEntries('caseStudy');

  const paths = caseStudies.map((caseStudy) => ({
    params: { slug: caseStudy.fields.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({
  params,
  draftMode = false,
}) => {
  const caseStudies = await fetchEntries(
    'caseStudy',
    {
      'fields.slug': params?.slug,
      limit: 1,
    },
    { preview: draftMode },
  );

  const caseStudy = caseStudies[0];

  if (!caseStudy) {
    return { notFound: true };
  }

  return {
    props: { caseStudy },
  };
};
