// apps/web/src/lib/sanity/queries/basicPage.ts
import type { BasicPage as BasicPageType } from '@/types/sanity.generated';
import type { SanityClient } from 'next-sanity';

import { projections } from '../groq/builders';
import { fetchOne } from '../groq/helpers';

const basicPageProjection = `
  _id,
  title,
  ${projections.slug},
  body
`;

export async function getBasicPage(slug: string, sanityClient?: SanityClient) {
  const query = `*[_type == "basicPage" && slug.current == $slug][0] {
    ${basicPageProjection}
  }`;

  return sanityClient
    ? sanityClient.fetch<BasicPageType>(query, { slug })
    : fetchOne<BasicPageType>(
        'basicPage',
        slug,
        basicPageProjection,
        sanityClient,
      );
}
