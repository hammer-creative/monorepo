// src/app/services/page.tsx
import { Title } from '@/components/common';
import {
  ServicesPageCardModule,
  ServicesPageHeroModule,
} from '@/components/modules';
import { client, getServicesPage, resolveModuleColors } from '@/lib/sanity';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  openGraph: {
    title: 'Services',
    type: 'website',
  },
};

export const revalidate = 60;

export default async function ServicesPage() {
  // Fetch services page data
  const servicesPage = await getServicesPage(client);

  // Guard: Early return if no page data
  if (!servicesPage) return null;

  // Resolve color values for all modules
  const modules = servicesPage.modules?.map(resolveModuleColors) || [];
  const [hero, ...cards] = modules;
  const regularCards = cards.slice(0, -1);
  const chyronCard = cards[cards.length - 1];

  return (
    <div className="layout-wrapper">
      {/* Hero Module */}
      {hero && (
        <section
          className="module hero-module"
          style={
            {
              '--module-text': hero.textColor?.hex,
            } as React.CSSProperties
          }
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <ServicesPageHeroModule data={hero as any} />
        </section>
      )}

      {/* Services Cards */}
      <div id="content-start" className="services-heading">
        <Title as="h2" variant="tertiary">
          Services
        </Title>
      </div>
      <div className="services-cards">
        {regularCards.map(
          (card: {
            _key: string;
            backgroundColor?: { hex?: string };
            textColor?: { hex?: string };
          }) => {
            const { _key, backgroundColor, textColor } = card;

            return (
              <section
                key={_key}
                className="module services-card-module"
                style={
                  {
                    '--module-bg': backgroundColor?.hex,
                    '--module-text': textColor?.hex,
                  } as React.CSSProperties
                }
              >
                <ServicesPageCardModule
                  data={card as any} // eslint-disable-line @typescript-eslint/no-explicit-any
                />
              </section>
            );
          },
        )}
      </div>

      {/* Chyron Card */}
      {chyronCard && (
        <section
          className="module chyron-card"
          style={
            {
              '--module-bg': chyronCard.backgroundColor?.hex,
              '--module-text': chyronCard.textColor?.hex,
            } as React.CSSProperties
          }
        >
          <ServicesPageCardModule
            data={chyronCard as any} // eslint-disable-line @typescript-eslint/no-explicit-any
            showClientIcons
          />
        </section>
      )}
    </div>
  );
}
