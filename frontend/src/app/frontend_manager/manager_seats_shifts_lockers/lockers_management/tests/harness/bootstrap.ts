/** Node test bootstrap for Locker Management's module-owned read-only MSW handlers. */
import { setupServer } from 'msw/node';
import { afterAll,afterEach,beforeAll } from 'vitest';
import { managerSeatsShiftsLockersHandlers } from '../../mocks/manager_lockers_management_handlers/ManagerLockersManagementHandlers';

export const managerLockersManagementHarnessServer = setupServer(...managerSeatsShiftsLockersHandlers);
beforeAll(() => managerLockersManagementHarnessServer.listen({ onUnhandledRequest: 'error' }));
afterEach(() => managerLockersManagementHarnessServer.resetHandlers());
afterAll(() => managerLockersManagementHarnessServer.close());
