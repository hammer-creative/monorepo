// apps/web/src/lib/queries/servicesPage.ts
import type { ServicesPage } from '@/types/sanity';
import type { SanityClient } from 'next-sanity';
import { projections, moduleProjections } from '../groq/builders';
import { fetchOne } from '../groq/helpers';

const fullProjection = `
  _id,
  title,
  ${projections.slug},
  modules[]{
    ${moduleProjections}
  }
`;

export async function getServicesPage(sanityClient?: SanityClient) {
  const query = `*[_type == "servicesPage"][0] {
    ${fullProjection}
  }`;

  return sanityClient
    ? sanityClient.fetch<ServicesPage>(query)
    : fetchOne<ServicesPage>(
        'servicesPage',
        'services',
        fullProjection,
        sanityClient,
      );
}
