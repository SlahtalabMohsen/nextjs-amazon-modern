import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import ClientProviders from '@/components/shared/client-providers'
import { getDirection } from '@/i18n-config'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { getSetting } from '@/lib/actions/setting.actions'
import { cookies } from 'next/headers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateMetadata() {
  const {
    site: { slogan, name, description, url },
  } = await getSetting()
  return {
    title: {
      template: `%s | ${name}`,
      default: `${name}. ${slogan}`,
    },
    description: description,
    metadataBase: new URL(url),
  }
}

export default async function AppLayout({
  params,
  children,
}: {
  params: { locale: string }
  children: React.ReactNode
}) {
  const setting = await getSetting()
  const currencyCookie = (await cookies()).get('currency')
  const currency = currencyCookie ? currencyCookie.value : 'USD'

  const { locale } = params
  // Ensure that the incoming `locale` is valid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()
  const dir = getDirection(locale)

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
        <div className="relative min-h-screen">
          {/* Default purple theme gradient (light mode) */}
          <div className="fixed inset-0 theme-purple-gradient-light dark:opacity-0 opacity-100 transition-opacity duration-500 gold-theme:hidden green-theme:hidden red-theme:hidden -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(253,224,71,0.4)_0%,rgba(167,139,250,0.4)_50%,rgba(253,224,71,0.4)_100%)] gradient-animate"></div>
          </div>
          
          {/* Gold theme gradient (light mode) */}
          <div className="fixed inset-0 theme-gold-gradient-light dark:opacity-0 opacity-0 transition-opacity duration-500 gold-theme:opacity-100 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(253,224,71,0.4)_0%,rgba(250,204,21,0.4)_50%,rgba(253,224,71,0.4)_100%)] gradient-animate"></div>
          </div>
          
          {/* Green theme gradient (light mode) */}
          <div className="fixed inset-0 theme-green-gradient-light dark:opacity-0 opacity-0 transition-opacity duration-500 green-theme:opacity-100 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(134,239,172,0.4)_0%,rgba(74,222,128,0.4)_50%,rgba(134,239,172,0.4)_100%)] gradient-animate"></div>
          </div>
          
          {/* Red theme gradient (light mode) */}
          <div className="fixed inset-0 theme-red-gradient-light dark:opacity-0 opacity-0 transition-opacity duration-500 red-theme:opacity-100 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(252,165,165,0.4)_0%,rgba(248,113,113,0.4)_50%,rgba(252,165,165,0.4)_100%)] gradient-animate"></div>
          </div>
          
          {/* Default purple theme gradient (dark mode) */}
          <div className="fixed inset-0 theme-purple-gradient-dark dark:opacity-100 opacity-0 transition-opacity duration-500 dark:gold-theme:opacity-0 dark:green-theme:opacity-0 dark:red-theme:opacity-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(249,115,22,0.4)_0%,rgba(139,92,246,0.4)_50%,rgba(249,115,22,0.4)_100%)] gradient-animate"></div>
          </div>
          
          {/* Gold theme gradient (dark mode) */}
          <div className="fixed inset-0 theme-gold-gradient-dark dark:opacity-0 opacity-0 transition-opacity duration-500 dark:gold-theme:opacity-100 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(234,179,8,0.4)_0%,rgba(253,224,71,0.3)_50%,rgba(234,179,8,0.4)_100%)] gradient-animate"></div>
          </div>
          
          {/* Green theme gradient (dark mode) */}
          <div className="fixed inset-0 theme-green-gradient-dark dark:opacity-0 opacity-0 transition-opacity duration-500 dark:green-theme:opacity-100 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(22,163,74,0.4)_0%,rgba(34,197,94,0.3)_50%,rgba(22,163,74,0.4)_100%)] gradient-animate"></div>
          </div>
          
          {/* Red theme gradient (dark mode) */}
          <div className="fixed inset-0 theme-red-gradient-dark dark:opacity-0 opacity-0 transition-opacity duration-500 dark:red-theme:opacity-100 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(220,38,38,0.4)_0%,rgba(239,68,68,0.3)_50%,rgba(220,38,38,0.4)_100%)] gradient-animate"></div>
          </div>
          
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ClientProviders setting={{ ...setting, currency }}>
              <div className="relative flex min-h-screen flex-col">
                <div className="flex-1">
                  <div className="container mx-auto px-4 py-8">
                    <div className="rounded-[2rem] neumorphic-light dark:neumorphic-dark p-8 animate-fade-in bg-white/50 dark:bg-[#2d1d38]/60 backdrop-blur-sm">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </ClientProviders>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  )
}
