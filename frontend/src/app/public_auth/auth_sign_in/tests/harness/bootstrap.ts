/** Standalone harness contract for the sign-in submodule.
 * Host runner must mount the route under Next.js/next-intl and provide a TanStack QueryClient.
 * API requests require the host `@/lib/api` implementation and NEXT_PUBLIC_AUTH_LOGIN_PATH.
 * This file intentionally does not fabricate a transport or claim an MSW server is running.
 */
export const publicAuthSignInHarnessRequirements = {
  providers: ['Next.js App Router', 'next-intl', 'TanStack Query v5'],
  environment: ['NEXT_PUBLIC_AUTH_LOGIN_PATH'],
  hostModules: ['@/lib/api'],
} as const;
