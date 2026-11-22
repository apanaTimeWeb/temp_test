/**
 * Isolated MSW bootstrap for this feature module.
 * Empty handlers are intentional when the supplied source does not contain an authoritative API contract.
 * Do not add endpoints or mutation behavior without the host contract.
 */
import { setupServer } from 'msw/node';
import { afterAll,afterEach,beforeAll } from 'vitest';

export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
