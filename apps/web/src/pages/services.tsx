// apps/web/src/pages/index.tsx
import { CaseStudyCardModule, TextModule } from '@/components/modules';
import {
  client,
  draftClient,
  getHomePage,
  resolveModuleColors,
} from '@/lib/sanity';
import type { HomePageType } from '@/types/sanity';
import type { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';

interface Props {
  homePage: HomePageType;
  draftMode?: boolean;
}

export default function HomePage({ homePage }: Props) {
  if (!homePage) return null;

  const [caseStudyCard, textModule1, textModule2, textModule3] =
    homePage.modules?.map(resolveModuleColors) || [];

  return (
    <>
      <NextSeo
        title="Home"
        titleTemplate="%s | Hammer Creative"
        openGraph={{ title: 'Home', type: 'website' }}
      />

      <article className="page home">
        {caseStudyCard && (
          <section
            className="module case-study-card-module"
            style={
              {
                '--module-bg':
                  caseStudyCard.backgroundColor?.hex ?? 'transparent',
                '--module-text':
                  'textColor' in caseStudyCard
                    ? (caseStudyCard.textColor?.hex ?? 'inherit')
                    : 'inherit',
                backgroundColor:
                  caseStudyCard.backgroundColor?.hex ?? 'transparent',
                color:
                  'textColor' in caseStudyCard
                    ? (caseStudyCard.textColor?.hex ?? 'inherit')
                    : 'inherit',
              } as React.CSSProperties
            }
          >
            <CaseStudyCardModule data={caseStudyCard as any} />
          </section>
        )}

        {textModule1 && (
          <section
            className="module text-module"
            style={
              {
                '--module-bg':
                  textModule1.backgroundColor?.hex ?? 'transparent',
                '--module-text':
                  'textColor' in textModule1
                    ? (textModule1.textColor?.hex ?? 'inherit')
                    : 'inherit',
                backgroundColor:
                  textModule1.backgroundColor?.hex ?? 'transparent',
                color:
                  'textColor' in textModule1
                    ? (textModule1.textColor?.hex ?? 'inherit')
                    : 'inherit',
              } as React.CSSProperties
            }
          >
            <TextModule data={textModule1 as any} />
          </section>
        )}

        {textModule2 && (
          <section
            className="module text-module"
            style={
              {
                '--module-bg':
                  textModule2.backgroundColor?.hex ?? 'transparent',
                '--module-text':
                  'textColor' in textModule2
                    ? (textModule2.textColor?.hex ?? 'inherit')
                    : 'inherit',
                backgroundColor:
                  textModule2.backgroundColor?.hex ?? 'transparent',
                color:
                  'textColor' in textModule2
                    ? (textModule2.textColor?.hex ?? 'inherit')
                    : 'inherit',
              } as React.CSSProperties
            }
          >
            <TextModule data={textModule2 as any} />
          </section>
        )}

        {textModule3 && (
          <section
            className="module text-module"
            style={
              {
                '--module-bg':
                  textModule3.backgroundColor?.hex ?? 'transparent',
                '--module-text':
                  'textColor' in textModule3
                    ? (textModule3.textColor?.hex ?? 'inherit')
                    : 'inherit',
                backgroundColor:
                  textModule3.backgroundColor?.hex ?? 'transparent',
                color:
                  'textColor' in textModule3
                    ? (textModule3.textColor?.hex ?? 'inherit')
                    : 'inherit',
              } as React.CSSProperties
            }
          >
            <TextModule data={textModule3 as any} />
          </section>
        )}
      </article>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { draftMode = false } = context;
  const sanityClient = draftMode ? draftClient : client;
  const homePage = await getHomePage(sanityClient);

  if (!homePage) return { notFound: true };

  return {
    props: {
      homePage,
      draftMode,
    },
    revalidate: 60,
  };
};
