import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Wires next-intl; points at ./i18n/request.ts by default.
// Source: https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
