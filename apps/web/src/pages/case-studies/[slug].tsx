import { HeroCopy, HeroHeadline, HeroImage } from '@/components/Hero';
import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import DOMPurify from 'isomorphic-dompurify';
import type { GetStaticProps, GetStaticPaths } from 'next';
import { fetchEntries } from '@chorusworks/contentful';
import type { EntrySkeletonType } from '@chorusworks/contentful';

interface CaseStudyFields {
  title: string;
  slug: string;
  imageText: Array<unknown>;
}

interface CaseStudySkeleton extends EntrySkeletonType {
  contentTypeId: 'caseStudy';
  fields: CaseStudyFields;
}

type CaseStudy = {
  sys: {
    id: string;
  };
  fields: CaseStudyFields;
};

type PageProps = {
  caseStudy: CaseStudy;
};

export default function CaseStudyPage({ caseStudy }: PageProps) {
  const { imageText, ...contentFields } =
    useContentfulLiveUpdates(caseStudy).fields;

  const {
    title = '',
    slug = '',
    hero = null,
    heroCopy: heroText = '',
  } = contentFields;

  console.log(hero);

  return (
    <div className="case-study">
      <HeroHeadline data={title} />
      {/* <HeroCopy data={heroText} /> */}
      <h2>h2 A First Step Into His Shoes</h2>
      <p className="large">
        LARGE TEXTFor our Announce, embodying the classic Indy feel was the top
        goal. That meant capturing what it feels like to think, fight, and
        explore like Indy. So we keyed into what makes his adventures unique —
        the swashbuckling, the globetrotting, the perilous antiquing — and
        presented them as an accessible homage with undeniable thrills.
      </p>
      <p className="medium">
        MEDIUM TEXT With an engagement rate of 16%, we beat the average campaign
        engagement rate three times over, as fans organically shared our
        creative beyond gaming circles..
      </p>
      <p className="small">
        SMALL TEXT With an engagement rate of 16%, we beat the average campaign
        engagement rate three times over, as fans organically shared our
        creative beyond gaming circles.
      </p>
      <div className="rubric">Services</div>
      <ul>
        <li>asdfasdf</li>
        <li>asdfasdf</li>
        <li>asdfasdf</li>
        <li>asdfasdf</li>
        <li>asdfasdf</li>
        <li>asdfasdf</li>
        <li>asdfasdf</li>
      </ul>
      {/* <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(moduleTextImage[0].text),
        }}
      /> */}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const caseStudies = await fetchEntries<CaseStudySkeleton>('caseStudy');

  const paths = caseStudies.map((caseStudy) => ({
    params: { slug: caseStudy.fields.slug as string },
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
  const caseStudies = await fetchEntries<CaseStudySkeleton>(
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
    revalidate: 60,
  };
};
