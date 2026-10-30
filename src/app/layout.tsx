import { cookies } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Geist, Geist_Mono, IBM_Plex_Sans_Arabic, Inter } from 'next/font/google'
import { AuthProvider, type AuthUser } from '@/components/auth/auth-provider'
import { EmergencyQuickActions } from '@/components/deafference/emergency-quick-actions'
import { SettingsProvider } from '@/components/deafference/settings-provider'
import { FloatingJudy } from '@/components/judy/floating-judy'
import { JudyChatExperience } from '@/components/judy-chat/JudyChatExperience'
import { NavigationTracker } from '@/components/shared/back-button'
import { getCurrentSession } from '@/lib/auth/current-user'
import { parseSettingsCookie, SETTINGS_COOKIE_NAME } from '@/lib/settings'
import { dirFor, localeFromLanguage } from '@/i18n/locale'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
// Fonts that only some pages or states use aren't preloaded: the browser fetches each one the first
// time text in it appears (Arabic letters, code, Judy's speech bubble, the chat panel), instead of
// every visitor downloading all of them up front.
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: false,
})
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  preload: false,
})
// Judy's bubble and chat (they used to load from fonts.googleapis.com, which blocked the first paint).
const inter = Inter({ variable: '--font-inter', subsets: ['latin'], preload: false })
const fraunces = Fraunces({ variable: '--font-fraunces', subsets: ['latin'], style: ['normal', 'italic'], axes: ['opsz'], preload: false })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Sign language, speech and text, both ways`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // No canonical/url here: a child page would inherit them and point at the home page. Each public
  // page sets its own (lib/site.ts pageMetadata).
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    alternateLocale: ['ar'],
    title: `${SITE_NAME} — Breaking communication barriers`,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
  category: 'accessibility',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf7f1' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1c26' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const session = await getCurrentSession()
  const initialUser: AuthUser | null = session
    ? { name: session.name, email: session.email, role: session.role === 'admin' ? 'admin' : 'user' }
    : null
  const initialSettings = parseSettingsCookie(cookieStore.get(SETTINGS_COOKIE_NAME)?.value)
  // Server-render the right lang/dir to avoid an LTR flash; SettingsProvider keeps it in sync
  // client-side (and exempts /admin, which stays English).
  const locale = localeFromLanguage(initialSettings.language)

  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      // Server-render a saved dark theme too, so it doesn't flash light first ("system" resolves client-side).
      className={`${geistSans.variable} ${geistMono.variable} ${plexArabic.variable} ${inter.variable} ${fraunces.variable} scroll-smooth${initialSettings.theme === 'dark' ? ' dark' : ''}`}
      // Lets Next turn smooth scrolling off during route changes (keeps it for in-page anchors).
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans antialiased text-foreground">
        <AuthProvider initialUser={initialUser}>
          <SettingsProvider initialSettings={initialSettings}>
            {children}
            <FloatingJudy />
            <JudyChatExperience />
            <NavigationTracker />
            <EmergencyQuickActions />
          </SettingsProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
