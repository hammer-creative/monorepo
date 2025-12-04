// apps/web/src/lib/queries/servicesPage.ts
import type { ServicesPageType } from '@/types/sanity';
import type { SanityClient } from 'next-sanity';
import { projections, moduleProjections } from '../groq/builders';
import { fetchOne } from '../groq/helpers';

const servicesPageProjection = `
  _id,
  title,
  ${projections.slug},
  modules[]{
    ${moduleProjections}
  }
`;

export async function getServicesPage(sanityClient?: SanityClient) {
  const query = `*[_type == "servicesPage"][0] {
    ${servicesPageProjection}
  }`;

  return sanityClient
    ? sanityClient.fetch<ServicesPageType>(query)
    : fetchOne<ServicesPageType>(
        'servicesPage',
        'services',
        servicesPageProjection,
        sanityClient,
      );
}
