// apps/web/src/lib/sanity/queries/servicesPage.ts
import type { ServicesPage as ServicesPageType } from '@/types/sanity.generated';
import type { SanityClient } from 'next-sanity';

import { moduleProjections, projections } from '../groq/builders';
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
