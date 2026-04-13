import { client, getAllCaseStudyTeasers } from '@/lib/sanity';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const caseStudies = await getAllCaseStudyTeasers(client);

  const workUrls = caseStudies.map((cs) => ({
    url: `https://hammercreative.com/work/${cs.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: 'https://hammercreative.com',
      lastModified: new Date('2026-03-30'),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://hammercreative.com/work',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://hammercreative.com/services',
      lastModified: new Date('2026-03-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...workUrls,
  ];
}
