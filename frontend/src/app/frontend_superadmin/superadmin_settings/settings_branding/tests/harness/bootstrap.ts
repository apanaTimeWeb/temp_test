// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_BRANDING_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/mocks/handlers/SuperadminSettingsBrandingMockHandlers';

/** Isolated MSW lifecycle for settings_branding; tests opt in by calling setupSystemBrandingMockServer(). */
export const SYSTEM_BRANDING_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_BRANDING_MSW_HANDLERS);
/**
 * Performs the setup system branding mock server operation within settings branding; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemBrandingMockServer(): void {
  beforeAll(() => SYSTEM_BRANDING_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_BRANDING_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_BRANDING_MOCK_SERVER.close());
}
