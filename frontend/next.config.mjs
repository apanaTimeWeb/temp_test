import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@tanstack/react-query': path.resolve(__dirname, 'node_modules/@tanstack/react-query'),
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/auth/login',
        destination: '/frontend_public/public_auth/auth_sign_in',
      },
      {
        source: '/auth/signup',
        destination: '/frontend_public/public_auth/auth_account_registration',
      },
      {
        source: '/auth/forgot-password',
        destination: '/frontend_public/public_auth/auth_password_recovery',
      },
      {
        source: '/auth/reset-password',
        destination: '/frontend_public/public_auth/auth_password_reset',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);

