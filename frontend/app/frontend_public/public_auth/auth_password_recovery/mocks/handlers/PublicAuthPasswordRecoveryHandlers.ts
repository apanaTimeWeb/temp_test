import { http, HttpResponse } from 'msw';
import { publicAuthPasswordRecoveryAcceptedFixture, publicAuthPasswordRecoveryRejectedFixture, publicAuthPasswordRecoveryInvalidEnvelopeFixture } from '@/app/frontend_public/public_auth/auth_password_recovery/mocks/fixtures/PublicAuthPasswordRecoveryFixtures';

/** Synthetic handler for a caller-supplied configured URL; scenario is test-only, not a server contract. */
export function createPublicAuthPasswordRecoveryHandler(endpoint: string, scenario: 'accepted' | 'rejected' | 'connection-failure' | 'invalid-envelope' = 'accepted') {
  if (!endpoint.trim()) return [];
  return [http.post(endpoint, () => {
    if (scenario === 'connection-failure') return HttpResponse.error();
    if (scenario === 'invalid-envelope') return HttpResponse.json(publicAuthPasswordRecoveryInvalidEnvelopeFixture);
    if (scenario === 'rejected') return HttpResponse.json(publicAuthPasswordRecoveryRejectedFixture, { status: 400 });
    return HttpResponse.json(publicAuthPasswordRecoveryAcceptedFixture);
  })];
}
