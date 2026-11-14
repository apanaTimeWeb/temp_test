// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_AUTO_SCALE_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/mocks/handlers/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsMockHandlers';

/** Isolated MSW lifecycle for library_capacity_scaling_recommendations; tests opt in by calling setupSystemAutoScaleMockServer(). */
export const SYSTEM_AUTO_SCALE_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_AUTO_SCALE_MSW_HANDLERS);
/**
 * Performs the setup system auto scale mock server operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemAutoScaleMockServer(): void {
  beforeAll(() => SYSTEM_AUTO_SCALE_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_AUTO_SCALE_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_AUTO_SCALE_MOCK_SERVER.close());
}
