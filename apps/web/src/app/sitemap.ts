import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://hammercreative.com',
      lastModified: new Date('2026-03-30'),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://hammercreative.com/work',
      lastModified: new Date('2026-03-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://hammercreative.com/services',
      lastModified: new Date('2026-03-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
