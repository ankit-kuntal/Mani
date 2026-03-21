import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mani-puzzle.vercel.app'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/claim', '/reward-submitted'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
