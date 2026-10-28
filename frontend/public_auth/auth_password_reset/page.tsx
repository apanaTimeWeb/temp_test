import PublicAuthResetPasswordPage from './components/PublicAuthResetPasswordPage';

/** Independently addressable password-reset route entry; OTP remains part of the reset request. */
export default function AuthPasswordResetRoute() {
  return <PublicAuthResetPasswordPage />;
}
