import { setupServer } from 'msw/node';
import { afterAll,afterEach,beforeAll } from 'vitest';

/** Global test transport only; feature handlers and fixtures stay inside their owning modules. */
export const mswTestServer = setupServer();

beforeAll(() => mswTestServer.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => mswTestServer.resetHandlers());
afterAll(() => mswTestServer.close());
