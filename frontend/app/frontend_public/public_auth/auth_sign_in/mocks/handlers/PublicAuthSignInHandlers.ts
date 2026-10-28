import { http, HttpResponse } from 'msw';
import { PUBLIC_AUTH_SIGN_IN_ACCEPTED, PUBLIC_AUTH_SIGN_IN_REJECTED, PUBLIC_AUTH_SIGN_IN_INVALID_ENVELOPE } from '@/app/frontend_public/public_auth/auth_sign_in/mocks/fixtures/PublicAuthSignInFixtures';

/** Synthetic response scenario for local tests only; this is not a backend contract. */
export type PublicAuthSignInMockScenario = 'accepted' | 'rejected' | 'connection-failure' | 'invalid-envelope';
/** Uses only a host-supplied endpoint. The host test harness must explicitly register this handler. */
export function createPublicAuthSignInHandler(endpoint: string, scenario: PublicAuthSignInMockScenario = 'accepted') {
  if (!endpoint.trim()) return [];
  return [http.post(endpoint, () => {
    if (scenario === 'connection-failure') return HttpResponse.error();
    if (scenario === 'invalid-envelope') return HttpResponse.json(PUBLIC_AUTH_SIGN_IN_INVALID_ENVELOPE);
    if (scenario === 'rejected') return HttpResponse.json(PUBLIC_AUTH_SIGN_IN_REJECTED, { status: 400 });
    return HttpResponse.json(PUBLIC_AUTH_SIGN_IN_ACCEPTED);
  })];
}
