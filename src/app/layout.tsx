import { cookies } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from 'next/font/google'
import { AuthProvider, type AuthUser } from '@/components/auth/auth-provider'
import { EmergencyQuickActions } from '@/components/deafference/emergency-quick-actions'
import { SettingsProvider } from '@/components/deafference/settings-provider'
import { FloatingJudy } from '@/components/judy/floating-judy'
import { getCurrentSession } from '@/lib/auth/current-user'
import { parseSettingsCookie, SETTINGS_COOKIE_NAME } from '@/lib/settings'
import { dirFor, localeFromLanguage } from '@/i18n/locale'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Deafference — AI Communication Platform',
  description:
    'A polished AI SaaS landing page and product architecture for speech-to-sign communication.',
  generator: 'v0.app',
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
      className={`${geistSans.variable} ${geistMono.variable} ${plexArabic.variable} scroll-smooth${initialSettings.theme === 'dark' ? ' dark' : ''}`}
      // Lets Next turn smooth scrolling off during route changes (keeps it for in-page anchors).
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans antialiased text-foreground">
        <AuthProvider initialUser={initialUser}>
          <SettingsProvider initialSettings={initialSettings}>
            {children}
            <FloatingJudy />
            <EmergencyQuickActions />
          </SettingsProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
