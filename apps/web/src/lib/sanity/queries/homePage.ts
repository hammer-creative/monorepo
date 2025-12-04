// apps/web/src/lib/queries/homePage.ts
import type { HomePageType } from '@/types/sanity';
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
