import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/lib/providers/query-provider'
import { ErrorProvider } from '@/lib/providers/error-provider'
import { ErrorBoundary } from '@/components/error-boundary'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
  preload: true,
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'SimplyMaid - Professional House Cleaning Services',
    template: '%s | SimplyMaid'
  },
  description: 'Expert cleaners delivering spotless homes across Australia\'s major cities',
  keywords: ['house cleaning', 'cleaning services', 'home cleaners', 'australia'],
  authors: [{ name: 'SimplyMaid' }],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: '/',
    title: 'SimplyMaid - Professional House Cleaning Services',
    description: 'Expert cleaners delivering spotless homes across Australia\'s major cities',
    siteName: 'SimplyMaid',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SimplyMaid - Professional House Cleaning Services',
    description: 'Expert cleaners delivering spotless homes across Australia\'s major cities',
  },
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable
      )}>
        <ErrorBoundary>
          <QueryProvider>
            <ErrorProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </ErrorProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}