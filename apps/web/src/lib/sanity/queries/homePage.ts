// apps/web/src/lib/sanity/queries/homePage.ts
import type { HomePage as HomePageType } from '@/types/sanity.generated';
import type { SanityClient } from 'next-sanity';
import { projections, moduleProjections } from '../groq/builders';
import { fetchOne } from '../groq/helpers';

const homePageProjection = `
  _id,
  title,
  ${projections.slug},
  modules[]{
    ${moduleProjections}
  }
`;

export async function getHomePage(sanityClient?: SanityClient) {
  const query = `*[_type == "homePage"][0] {
    ${homePageProjection}
  }`;

  return sanityClient
    ? sanityClient.fetch<HomePageType>(query)
    : fetchOne<HomePageType>(
        'servicesPage',
        'services',
        homePageProjection,
        sanityClient,
      );
}
