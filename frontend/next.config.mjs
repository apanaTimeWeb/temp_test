import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@tanstack/react-query': path.resolve(__dirname, 'node_modules/@tanstack/react-query'),
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/auth/login',
        destination: '/public_auth/auth_sign_in',
      },
      {
        source: '/auth/signup',
        destination: '/public_auth/auth_account_registration',
      },
      {
        source: '/auth/forgot-password',
        destination: '/public_auth/auth_password_recovery',
      },
      {
        source: '/auth/reset-password',
        destination: '/public_auth/auth_password_reset',
      },
      {
        source: '/frontend_public/public_auth',
        destination: '/public_auth',
      },
      {
        source: '/frontend_public/public_auth/auth_sign_in',
        destination: '/public_auth/auth_sign_in',
      },
      {
        source: '/frontend_public/public_auth/auth_account_registration',
        destination: '/public_auth/auth_account_registration',
      },
      {
        source: '/frontend_public/public_auth/auth_password_recovery',
        destination: '/public_auth/auth_password_recovery',
      },
      {
        source: '/frontend_public/public_auth/auth_password_reset',
        destination: '/public_auth/auth_password_reset',
      },
      {
        source: '/manager',
        destination: '/frontend_manager/manager_dashboard/dashboard_overview',
      },
      {
        source: '/manager/dashboard',
        destination: '/frontend_manager/manager_dashboard/dashboard_overview',
      },
      {
        source: '/manager/manager_dashboard',
        destination: '/frontend_manager/manager_dashboard/dashboard_overview',
      },
      {
        source: '/manager/reports',
        destination: '/frontend_manager/manager_dashboard/dashboard_reports',
      },
      {
        source: '/manager/dashboard_reports',
        destination: '/frontend_manager/manager_dashboard/dashboard_reports',
      },
      {
        source: '/manager/:path*',
        destination: '/frontend_manager/:path*',
      },
      {
        source: '/admin',
        destination: '/frontend_admin/admin_dashboard/dashboard_overview',
      },
      {
        source: '/admin/dashboard',
        destination: '/frontend_admin/admin_dashboard/dashboard_overview',
      },
      {
        source: '/admin/admin_dashboard',
        destination: '/frontend_admin/admin_dashboard/dashboard_overview',
      },
      {
        source: '/admin/:path*',
        destination: '/frontend_admin/:path*',
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

