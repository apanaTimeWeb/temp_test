import PublicAuthSignInPage from '@/app/public_auth/auth_sign_in/components/PublicAuthSignInPage';

/** Autonomous sign-in route; the existing public URL rewrite remains host-owned. */
export default function PublicAuthSignInRoute() {
  return <PublicAuthSignInPage />;
}
