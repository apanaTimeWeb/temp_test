import { http, HttpResponse } from 'msw';
import { PUBLIC_AUTH_REGISTRATION_ACCEPTED, PUBLIC_AUTH_REGISTRATION_REJECTED, PUBLIC_AUTH_REGISTRATION_INVALID_ENVELOPE } from '../fixtures/PublicAuthRegistrationFixtures';

/** Synthetic response scenario for local tests only; this is not a backend contract. */
export type PublicAuthRegistrationMockScenario = 'accepted' | 'rejected' | 'connection-failure' | 'invalid-envelope';
/** Uses only a host-supplied endpoint. Register explicitly in the test harness; never installed in production. */
export function createPublicAuthRegistrationHandler(endpoint: string, scenario: PublicAuthRegistrationMockScenario = 'accepted') {
  if (!endpoint.trim()) return [];
  return [http.post(endpoint, () => {
    if (scenario === 'connection-failure') return HttpResponse.error();
    if (scenario === 'invalid-envelope') return HttpResponse.json(PUBLIC_AUTH_REGISTRATION_INVALID_ENVELOPE);
    if (scenario === 'rejected') return HttpResponse.json(PUBLIC_AUTH_REGISTRATION_REJECTED, { status: 400 });
    return HttpResponse.json(PUBLIC_AUTH_REGISTRATION_ACCEPTED);
  })];
}
