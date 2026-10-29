import { http, HttpResponse } from 'msw';
import { acceptedResetFixture, rejectedResetFixture, invalidResetEnvelopeFixture } from '@/app/public_auth/auth_password_reset/mocks/fixtures/PublicAuthPasswordResetFixtures';

/** Synthetic response scenario for local tests only; this is not a backend contract. */
export type PublicAuthPasswordResetMockScenario = 'accepted' | 'rejected' | 'connection-failure' | 'invalid-envelope';
/** The OTP remains part of the existing reset POST. Endpoint is always supplied by the host test harness. */
export function createPublicAuthPasswordResetHandler(endpoint: string, scenario: PublicAuthPasswordResetMockScenario = 'accepted') {
  if (!endpoint.trim()) return [];
  return [http.post(endpoint, () => {
    if (scenario === 'connection-failure') return HttpResponse.error();
    if (scenario === 'invalid-envelope') return HttpResponse.json(invalidResetEnvelopeFixture);
    if (scenario === 'rejected') return HttpResponse.json(rejectedResetFixture, { status: 400 });
    return HttpResponse.json(acceptedResetFixture);
  })];
}
