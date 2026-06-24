// next-intl middleware.
// NOTE: Next.js 16 renamed `middleware.ts` -> `proxy.ts`.
// Source: https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for api, _next, _vercel and files with an extension
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
