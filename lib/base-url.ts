import { headers } from 'next/headers';

/**
 * Absolute origin of the current request (e.g. `https://titanpoe.app` or
 * `http://localhost:3000`). Used to build absolute redirect URLs for the PSP
 * (Stripe Checkout success/cancel) from server actions. Derives the scheme from
 * the forwarded proto on hosted platforms, defaulting to http only for localhost.
 */
export async function getOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get('host') ?? 'localhost:3000';
  const proto =
    h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}
