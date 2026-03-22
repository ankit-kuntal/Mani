import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { FirebaseProvider } from '@/components/auth/FirebaseProvider'
import { Toaster } from 'sonner'
import Script from 'next/script'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mani-puzzle.vercel.app'),
  title: {
    default: 'Mani Puzzle - Solve Challenging Puzzles & Win Rewards',
    template: '%s | Mani Puzzle'
  },
  description: 'Challenge yourself with ultra-hard puzzles and win exciting rewards. Test your problem-solving skills, compete with others, and claim prizes when you solve the puzzle correctly.',
  keywords: ['puzzle', 'brain teaser', 'rewards', 'challenge', 'problem solving', 'win prizes', 'logic puzzle', 'mind games'],
  authors: [{ name: 'Mani Puzzle Team' }],
  creator: 'Mani Puzzle',
  publisher: 'Mani Puzzle',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Mani Puzzle',
    title: 'Mani Puzzle - Solve Challenging Puzzles & Win Rewards',
    description: 'Challenge yourself with ultra-hard puzzles and win exciting rewards. Test your problem-solving skills and claim prizes!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mani Puzzle - Solve & Win',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mani Puzzle - Solve Challenging Puzzles & Win Rewards',
    description: 'Challenge yourself with ultra-hard puzzles and win exciting rewards!',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          ></script>
        )}
        {/* Structured Data for SEO */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Mani Puzzle',
              description: 'Challenge yourself with ultra-hard puzzles and win exciting rewards.',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mani-puzzle.vercel.app',
              applicationCategory: 'Game',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
        <Toaster position="top-center" />
        <Analytics />
      </body>
    </html>
  )
}
