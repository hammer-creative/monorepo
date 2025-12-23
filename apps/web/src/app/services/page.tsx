// src/app/services/page.tsx
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
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';

export const metadata: Metadata = {
  title: 'Services',
  openGraph: {
    title: 'Services',
    type: 'website',
  },
};

export const revalidate = 60;

async function getServicesPageData() {
  const { isEnabled } = await draftMode();
  const sanityClient = isEnabled ? draftClient : client;
  const servicesPage = await getServicesPage(sanityClient);
  return servicesPage;
}

export default async function ServicesPage() {
  const servicesPage = await getServicesPageData();

  if (!servicesPage) return null;

  const [hero, ...cards] = servicesPage.modules?.map(resolveModuleColors) || [];

  return (
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
  );
}
