// next-intl v4 routing config (locales + default)
// Source: https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru'],
  defaultLocale: 'en'
});
