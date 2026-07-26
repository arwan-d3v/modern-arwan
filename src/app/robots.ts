import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/studio/'],
    },
    sitemap: 'https://isarwan.dev/sitemap.xml', // Update with actual domain
  };
}
