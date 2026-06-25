// Root locale layout — replaces app/layout.tsx in the next-intl i18n-routing setup.
// Source: https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
import {Suspense} from 'react';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {Inter, Unbounded} from 'next/font/google';
import {routing} from '@/i18n/routing';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {FlashToaster} from '@/components/flash-toaster';
import '../globals.css';

// Body: Inter (Latin + Cyrillic). Display: Unbounded — a bold geometric display
// face that ships Latin + Cyrillic, so EN and RU headings share one look.
const fontSans = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});
const fontDisplay = Unbounded({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display-face',
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Props) {
  // Next.js 15/16: params is a Promise and must be awaited.
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Required for static rendering with next-intl.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`dark ${fontSans.variable} ${fontDisplay.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <Suspense>
            <FlashToaster />
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
