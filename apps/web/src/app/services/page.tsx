// apps/web/src/app/services/page.tsx

import { LongArrow, Text } from '@/components/common';
import {
  ServicesPageCardModule,
  ServicesPageHeroModule,
} from '@/components/modules';
import { CaseStudyCarousel } from '@/components/modules/Carousel';
import { buildMetadata } from '@/config/metadata';
import {
  client,
  getAllCaseStudyTeasers,
  getServicesPage,
  resolveModuleColors,
} from '@/lib/sanity';
import Link from 'next/link';

const bem = 'services-page';

export const metadata = buildMetadata('Services');

export const revalidate = 30;

/**
 * Fetches and renders the Services page from Sanity. The first module is the
 * hero, the last is the chyron/clients card, everything between renders as
 * service cards.
 *
 * @remarks
 * `CaseStudyCarousel` expects a Sanity module shape `{ _type, caseStudies }`
 * because it was built to consume CMS documents directly. Since the studies
 * here come from a standalone query, we reconstruct that shape at the call
 * site. Consider accepting a plain `caseStudies` prop to remove the coupling.
 */
export default async function ServicesPage() {
  const [servicesPage, allCaseStudies] = await Promise.all([
    getServicesPage(client),
    getAllCaseStudyTeasers(client),
  ]);

  if (!servicesPage) return null;

  const modules = servicesPage.modules?.map(resolveModuleColors) ?? [];
  const [hero, ...cards] = modules;
  const regularCards = cards.slice(0, -1);
  const chyronCard = cards.at(-1);

  return (
    <div className={`${bem}`}>
      {hero && (
        <section
          className={`module ${bem}__hero`}
          style={
            { '--module-text': hero.textColor?.hex } as React.CSSProperties
          }
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <ServicesPageHeroModule data={hero as any} />
        </section>
      )}

      <div className="subheader">
        <Text as="h2" variant="tertiary" text="Services" />
      </div>

      <div className={`${bem}__cards`}>
        {regularCards.map((card) => (
          <section
            key={card._key}
            className={`module ${bem}-card`}
            style={
              {
                '--module-bg': card.backgroundColor?.hex,
                '--module-text': card.textColor?.hex,
              } as React.CSSProperties
            }
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <ServicesPageCardModule data={card as any} />
          </section>
        ))}
      </div>

      {chyronCard && (
        <section
          className={`module ${bem}__chyron`}
          style={
            {
              '--module-bg': chyronCard.backgroundColor?.hex,
              '--module-text': chyronCard.textColor?.hex,
            } as React.CSSProperties
          }
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <ServicesPageCardModule data={chyronCard as any} showClientIcons />
        </section>
      )}

      {allCaseStudies.length > 0 && (
        <section className={`module case-study-carousel-module`}>
          <Link href="/work" className="subheader">
            <Text as="h3" variant="tertiary" text="Case Studies" />
            <LongArrow className="cta-link" direction="right" />
          </Link>
          <CaseStudyCarousel
            data={{ _type: 'caseStudyCarousel', caseStudies: allCaseStudies }}
          />
        </section>
      )}
    </div>
  );
}
