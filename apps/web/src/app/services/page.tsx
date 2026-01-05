// src/app/services/page.tsx
import {
  ServicesPageHeroModule,
  ServicesPageCardModule,
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

  return (
    <article className="page services">
      {/* Hero Module */}
      {hero && (
        <section
          className="module services-page-hero-module"
          style={
            {
              '--module-bg': hero.backgroundColor?.hex,
              '--module-text': hero.textColor?.hex,
            } as React.CSSProperties
          }
        >
          <ServicesPageHeroModule data={hero as any} />
        </section>
      )}

      {/* Services Cards */}
      <div className="cards">
        <div className="services-heading">Services</div>
        {cards.map((card: any, index: number) => {
          const { _key, backgroundColor, textColor } = card;
          const isLastCard = index === cards.length - 1;

          return (
            <section
              key={_key}
              className="module services-page-card-module"
              style={
                {
                  '--module-bg': backgroundColor?.hex,
                  '--module-text': textColor?.hex,
                } as React.CSSProperties
              }
            >
              <ServicesPageCardModule
                data={card}
                showClientIcons={isLastCard}
              />
            </section>
          );
        })}
      </div>
    </article>
  );
}
