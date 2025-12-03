// apps/web/src/pages/services.tsx
// apps/web/src/pages/services.tsx
import { ClientIcons } from '@/components/common/ClientIcons';
import {
  ServicesPageHeroModule,
  ServicesPageCardModule,
} from '@/components/modules';
import {
  client,
  draftClient,
  getServicesPage,
  resolveModuleColors,
} from '@/lib/sanity';
import type { ServicesPageType } from '@/types/sanity';
import type { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';

interface Props {
  servicesPage: ServicesPageType;
  draftMode?: boolean;
}

export default function ServicesPage({ servicesPage }: Props) {
  if (!servicesPage) return null;

  const [hero, ...cards] = servicesPage.modules?.map(resolveModuleColors) || [];

  return (
    <>
      <NextSeo
        title="Services"
        titleTemplate="%s | Hammer Creative"
        openGraph={{ title: 'Services', type: 'website' }}
      />

      <article className="page services">
        {hero && (
          <section
            className="module services-page-hero-module"
            style={
              {
                '--module-bg': hero.backgroundColor?.hex ?? 'transparent',
                '--module-text':
                  'textColor' in hero
                    ? (hero.textColor?.hex ?? 'inherit')
                    : 'inherit',
                backgroundColor: hero.backgroundColor?.hex ?? 'transparent',
                color:
                  'textColor' in hero
                    ? (hero.textColor?.hex ?? 'inherit')
                    : 'inherit',
              } as React.CSSProperties
            }
          >
            <ServicesPageHeroModule data={hero as any} />
          </section>
        )}

        <div className="cards">
          <div className="services-heading">Services</div>
          {cards.map((card, index) => (
            <section
              key={card._key}
              className="module services-page-card-module"
              style={
                {
                  '--module-bg': card.backgroundColor?.hex ?? 'transparent',
                  '--module-text':
                    'textColor' in card
                      ? (card.textColor?.hex ?? 'inherit')
                      : 'inherit',
                  backgroundColor: card.backgroundColor?.hex ?? 'transparent',
                  color:
                    'textColor' in card
                      ? (card.textColor?.hex ?? 'inherit')
                      : 'inherit',
                } as React.CSSProperties
              }
            >
              <ServicesPageCardModule
                data={card as any}
                showClientIcons={index === cards.length - 1}
              />
            </section>
          ))}
        </div>
      </article>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { draftMode = false } = context;
  const sanityClient = draftMode ? draftClient : client;
  const servicesPage = await getServicesPage(sanityClient);

  if (!servicesPage) return { notFound: true };

  return {
    props: {
      servicesPage,
      draftMode,
    },
    revalidate: 60,
  };
};
