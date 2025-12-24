import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Image domains for external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'strapi-tippit-u63628.vm.elestio.app',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
    ],
    // Keep domains for backward compatibility, but remotePatterns is preferred
    domains: ['strapi-tippit-u63628.vm.elestio.app', 'img.clerk.com', 'images.clerk.dev'],
  },
  // Environment variables validation
  env: {
    STRAPI_API_URL: process.env.STRAPI_API_URL,
    STRAPI_API_KEY: process.env.STRAPI_API_KEY,
  },
};

export default withNextIntl(nextConfig);
