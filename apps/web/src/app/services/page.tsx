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

  const modules = servicesPage.modules?.map(resolveModuleColors) || [];
  const [hero, ...cards] = modules;

  return (
    <article className="page services">
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

      <div className="cards">
        <div className="services-heading">Services</div>
        {cards.map((card: any, index: number) => (
          <section
            key={card._key}
            className="module services-page-card-module"
            style={
              {
                '--module-bg': card.backgroundColor?.hex,
                '--module-text': card.textColor?.hex,
              } as React.CSSProperties
            }
          >
            <ServicesPageCardModule
              data={card}
              showClientIcons={index === cards.length - 1}
            />
          </section>
        ))}
      </div>
    </article>
  );
}
