// Locale-aware navigation APIs — use these instead of next/link & next/navigation
// Source: https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
