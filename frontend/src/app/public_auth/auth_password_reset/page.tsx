import PublicAuthResetPasswordPage from '@/app/public_auth/auth_password_reset/components/PublicAuthResetPasswordPage';

/** Independently addressable password-reset route entry; OTP remains part of the reset request. */
export default function AuthPasswordResetRoute() {
  return <PublicAuthResetPasswordPage />;
}
