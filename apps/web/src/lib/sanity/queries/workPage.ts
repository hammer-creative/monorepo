// apps/web/src/lib/sanity/queries/workPage.ts
import type { WorkPage as WorkPageType } from '@/types/sanity.generated';
import type { SanityClient } from 'next-sanity';

import { moduleProjections, projections } from '../groq/builders';
import { fetchOne } from '../groq/helpers';

const workPageProjection = `
  _id,
  title,
  ${projections.slug},
  modules[]{
    ${moduleProjections}
  }
`;

export async function getWorkPage(sanityClient?: SanityClient) {
  const query = `*[_type == "workPage"][0] {
    ${workPageProjection}
  }`;

  return sanityClient
    ? sanityClient.fetch<WorkPageType>(query)
    : fetchOne<WorkPageType>(
        'workPage',
        'work',
        workPageProjection,
        sanityClient,
      );
}
