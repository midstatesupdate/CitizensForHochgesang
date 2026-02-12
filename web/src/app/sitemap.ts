import type {MetadataRoute} from 'next'

import {SITE_URL} from '@/lib/site'

export const dynamic = 'force-static'

const staticRoutes = ['/', '/news', '/events', '/faq', '/media', '/press', '/support']

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }))
}
