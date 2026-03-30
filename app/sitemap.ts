import { MetadataRoute } from 'next';

const BASE_URL = 'https://episodle.me';

export default function sitemap(): MetadataRoute.Sitemap {
  const last30Days = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last30Days.push(d.toLocaleDateString('en-CA'));
  }

  const archiveEntries = last30Days.map((date) => ({
    url: `${BASE_URL}/archive/${date}`,
    lastModified: new Date(),
    changeFrequency: 'never' as const,
    priority: 0.5,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tv`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/archive`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...archiveEntries,
  ];
}
