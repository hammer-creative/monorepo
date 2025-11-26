// apps/web/src/lib/sanity/groq/helpers.ts
// apps/web/src/lib/sanity/groq/helpers.ts
import type { SanityClient } from 'next-sanity';
import { client as defaultClient } from '../client';

type FetchOptions = {
  params?: Record<string, any>;
  cache?: RequestCache;
  tags?: string[];
  revalidate?: number;
  client?: SanityClient;
};

export async function fetchSanity<T>(
  query: string,
  options: FetchOptions = {},
): Promise<T> {
  const {
    params = {},
    cache = 'force-cache',
    tags = [],
    revalidate,
    client = defaultClient,
  } = options;

  try {
    return await client.fetch<T>(query, params, {
      cache,
      next: { tags, revalidate },
    });
  } catch (error) {
    console.error('Sanity fetch error:', query, error);
    throw error;
  }
}

export async function fetchOne<T>(
  type: string,
  slug: string,
  projection: string,
  client?: SanityClient,
): Promise<T | null> {
  const query = `*[_type == $type && slug.current == $slug][0]{ ${projection} }`;

  return fetchSanity<T | null>(query, {
    params: { type, slug },
    tags: [type, slug],
    client,
  });
}

export async function fetchAll<T>(
  type: string,
  projection: string,
  ordering: string = '| order(_createdAt desc)',
  client?: SanityClient,
): Promise<T[]> {
  const query = `*[_type == $type] ${ordering} { ${projection} }`;

  return fetchSanity<T[]>(query, {
    params: { type },
    tags: [type],
    client,
  });
}

export async function fetchSlugs(
  type: string,
  client?: SanityClient,
): Promise<{ slug: string }[]> {
  const query = `*[_type == $type]{ "slug": slug.current }`;

  return fetchSanity<{ slug: string }[]>(query, {
    params: { type },
    tags: [type, 'slugs'],
    client,
  });
}
